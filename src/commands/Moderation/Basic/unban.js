const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['ub', 'unbean'],
			description: language => language.get('COMMAND_UNBAN_DESCRIPTION'),
			usage: '<user  or  users:users> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [users, reason]) {
		const bannable = await this.getBannable(msg.member, users);
		if (!bannable.length) return msg.responder.error(msg.language.get('COMMAND_UNBAN_NOPERMS', users.length > 1));

		const moderator = msg.author;

		await this.executeUnbans(bannable, reason, msg.guild, moderator);
		await this.logUnbans(msg.guild, bannable, reason, moderator);

		return msg.responder.success();
	}

	async getBannable(executor, targets) {
		const ids = new Set();
		targets.forEach(async target => await executor.guild.members.fetch(target.id).catch(() => null));
		return targets
			.filter(target => {
				const member = executor.guild.members.get(target.id);
				if (ids.has(target.id)) return false;
				ids.add(target.id);
				if (!member) return true;
				if (executor.guild.owner.id === executor.id) return executor.id !== member.id;
				return executor.roles.highest.position > member.roles.highest.position;
			});
	}

	async executeUnbans(users, reason, guild, moderator) {
		for (const user of users) {
			guild.modCache.add(user.id);
			await guild.members.unban(user.id, `${moderator.tag} | ${reason || guild.language.get('COMMAND_UNBAN_NOREASON')}`);
			this.updateSchedule(user);
		}
	}

	logUnbans(guild, bannable, reason, moderator) {
		return bannable.length > 1
			? guild.log.unban({ users: bannable, reason, moderator })
			: guild.log.unban({ user: bannable[0], reason, moderator });
	}

	updateSchedule(user) {
		const unbanTask = this.client.schedule.tasks.find(task => task.data.users.includes(user.id) && task.taskName === 'endTempban');
		if (!unbanTask) return;
		const { time, data } = unbanTask;
		this.client.schedule.delete(unbanTask.id);
		data.users = data.users.filter(id => id !== user.id);
		if (data.users.length !== 0) { this.client.schedule.create('endTempban', time, { data }); }
	}


};
