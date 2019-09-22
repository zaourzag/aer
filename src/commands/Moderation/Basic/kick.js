const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['KICK_MEMBERS'],
			aliases: ['k', 'boot', '409'],
			description: language => language.get('COMMAND_KICK_DESCRIPTION'),
			usage: '<user  or  users:members> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.KICK_MEMBERS;
	}

	async run(msg, [users, reason]) {
		const kickable = await this.getKickable(msg.member, users);
		await this.executeKicks(kickable, reason, msg.guild, msg.author);

	}

	async getKickable(executor, targets) {
		const ids = new Set(); // cache for filtering duplicate ids in a bulk kick
		return targets
			.filter(target => {
				if (ids.has(target.id)) return false;
				ids.add(target.id);
				return executor.roles.highest.position > target.roles.highest.position;
			});
	}

	async executeKicks(users, reason, guild, moderator) {
		for (const user of users) {
			guild.modCache.add(user.id);
			user.kick(`${moderator.tag} | ${reason || guild.language.get('COMMAND_KICK_NOREASON')}`);
		}
	}

	logKick(guild, users, reason, moderator) {
		return guild.log.kick({
			user: users.length === 1 ? users[0] : null,
			users: users.length > 1 ? users : null,
			reason, moderator
		})
	}


};
