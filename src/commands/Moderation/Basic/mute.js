const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['m', 'silence', '403'],
			description: language => language.get('COMMAND_MUTE_DESCRIPTION'),
			usage: '<user  or  users:members> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [users, reason]) {
		const muteable = await this.getMuteable(msg.member, users);
		if (!muteable.length) return msg.responder.error(msg.language.get('COMMAND_MUTE_NOPERMS', users.length > 1));

		const muterole = msg.guild.settings.get('mod.roles.mute') || await msg.guild.createMuteRole();

		await this.executeMutes(muteable, reason, msg.guild, msg.author, muterole);
		await this.logMute(msg.guild, muteable.map(member => member.user), reason, msg.author);

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

	async executeMutes(users, reason, guild, moderator, muterole) {
		for (const member of users) {
			guild.modCache.add(member.id);
			member.mute(muterole, `${moderator.tag} | ${reason || guild.language.get('COMMAND_MUTE_NOREASON')}`);
		}
	}

	logMute(guild, users, reason, moderator) {
		return guild.log.mute({
			user: users.length === 1 ? users[0] : null,
			users: users.length > 1 ? users : null,
			reason, moderator
		});
	}


};
