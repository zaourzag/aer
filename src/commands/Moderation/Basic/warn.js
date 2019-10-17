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
			member.settings.update('warnings', { reason, moderator: msg.member.id }, { arrayAction: 'add' });
		}
		msg.responder.success();
		const options = {
			reason,
			moderator: msg.author
		};
		if (members.length > 1) options.users = members.map(member => member.id)
		else options.user = members[0].user;
		msg.guild.log.warn(options);
	}


};
