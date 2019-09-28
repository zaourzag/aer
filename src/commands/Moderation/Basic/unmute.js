const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['um', 'release'],
			description: language => language.get('COMMAND_UNMUTE_DESCRIPTION'),
			usage: '<user  or  users:members> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [users, reason]) {
		const muteable = await this.getMuteable(msg.member, users);
		if (!muteable.length) return msg.responder.error(msg.language.get('COMMAND_UNMUTE_NOPERMS', users.length > 1));

		await this.executeUnmutes(muteable, reason, msg.guild, msg.author);
		await this.logUnmute(msg.guild, muteable.map(member => member.user), reason, msg.author);

		return msg.responder.success();
	}

	async getMuteable(executor, targets) {
		const ids = new Set();
		return targets
			.filter(target => {
				if (ids.has(target.id)) return false;
				ids.add(target.id);
				return executor.roles.highest.position > target.roles.highest.position;
			});
	}

	async executeUnmutes(users, reason, guild, moderator) {
		for (const member of users) {
			guild.modCache.add(member.id);
			member.unmute(`${moderator.tag} | ${reason || guild.language.get('COMMAND_UNMUTE_NOREASON')}`);
			this.updateSchedule(member);
		}
	}


	logUnmute(guild, muteable, reason, moderator) {
		return muteable.length > 1
			? guild.log.unmute({ users: muteable, reason, moderator })
			: guild.log.unmute({ user: muteable[0], reason, moderator });
	}

	updateSchedule(user) {
		const unmuteTask = this.client.schedule.tasks.find(task => task.data.users.includes(user.id) && task.taskName === 'endTempmute');
		if (!unmuteTask) return;
		const { time, data } = unmuteTask;
		this.client.schedule.delete(unmuteTask.id);
		data.users = data.users.filter(id => id !== user.id);
		if (data.users.length !== 0)
			this.client.schedule.create('endTempmute', time, { data });
	}


};
