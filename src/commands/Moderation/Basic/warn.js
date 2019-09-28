const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['w'],
			description: language => language.get('COMMAND_WARN_DESCRIPTION'),
			usage: '<user  or  users:members> [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [members, reason = msg.language.get('COMMAND_WARN_NOREASON')]) {
		for (const member of members) {
			member.settings.update('warns', { reason, moderator: msg.member.id }, { arrayAction: 'add' });
		}
		msg.responder.success();
	}


};
