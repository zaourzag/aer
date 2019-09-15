const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['b', 'bean', '410'],
			description: language => language.get('COMMAND_BAN_DESCRIPTION').join('\n'),
			usage: '<user  or  users:users> [duration:time] [purge|p|soft|s] [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [users, duration, purge = false, reason]) {

		const bannable = await this.getBannable(msg.member, users);
		if (!bannable.length) return msg.responder.error(msg.language.get('COMMAND_BAN_NOPERMS', users.length > 1));

		const soft = ['soft', 's'].includes(purge);
		if (duration && soft) return msg.responder.error(msg.language.get('COMMAND_BAN_CONFLICT'));

		const moderator = msg.author;

		await this.executeBans(bannable, duration, reason, purge, soft, msg.guild, moderator);
		await this.logBans(msg.guild, bannable, duration, reason, soft, moderator);

		msg.responder.success();
	}

	async getBannable(executor, targets) {
		const ids = new Set(); // cache for filtering duplicate ids in a bulkban
		targets.forEach(async target => await executor.guild.members.fetch(target.id).catch(() => null));
		return targets
			.filter(target => {
				const member = executor.guild.members.get(target.id);
				if (ids.has(target.id)) return false;
				ids.add(target.id);
				if (!member) return true;
				return executor.roles.highest.position > target.roles.highest.position;
			});
	}

	async executeBans(users, duration, reason, purge, soft, guild, moderator) {
		for (const user of users) {
			guild.modCache.add(user.id);
			await guild.members.ban(user.id, { reason: `${duration ? `[temp]` : ''} ${moderator.tag} | ${reason || guild.language.get('COMMAND_BAN_NOREASON')}`, days: (purge) ? 1 : 0 });
			if (soft) {
				guild.modCache.add(user.id);
				await guild.members.unban(user.id, guild.language.get('COMMAND_BAN_SOFTBANRELEASED'));
			}
		}
		if (duration) this.client.schedule.create('endTempban', duration, { data: { users: users.map(u => u.id), guild: guild.id } });
	}

	logBans(guild, bannable, duration, reason, soft, moderator) {
		const action = bannable.length > 1
			? 'bulkBan'
			: duration
				? 'tempban'
				: soft
					? 'softban'
					: 'ban';
		action === 'bulkBan'
			? guild.log.bulkBan({ users: bannable, reason, duration, moderator })
			: guild.log[action]({ user: bannable[0], reason, duration, moderator });
	}


};
