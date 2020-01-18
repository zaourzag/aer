// Author: William Johnstone <william@endevrr.com>
const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['rero'],
			description: language => language.get('COMMAND_REACTIONROLE_DESCRIPTION'),
			usage: '<add|remove> [channel:channel] <messageid:string{17,18}> <emote:emoji> <role:rolename>',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [action, channel = msg.channel, _id, emote, role]) {

		const reactionRole = {
			messageid: _id,
			emoteid: emote.id,
			roleid: role.id
		}

		const reactionRoles = msg.guild.settings.get('mod.roles.reactionRoles');

		const filter = (item) => {
			return item.messageid === reactionRole.messageid &&
				item.emoteid === reactionRole.emoteid &&
				item.roleid === reactionRole.roleid;
		}

		if (action === "add") {
			await channel.messages.fetch(_id).then(message => {
				const equalReactionRoles = reactionRoles.filter(item => filter(item))

				if (equalReactionRoles.length > 0) return msg.responder.error(msg.language.get('COMMAND_REACTIONROLE_ROLE_EXIST'));
	
				msg.guild.settings.update('mod.roles.reactionRoles', reactionRole, { arrayAction: 'add' })
				message.react(emote.id);
				msg.responder.success(msg.language.get('COMMAND_REACTIONROLE_ROLE_ADDED'));
			}).catch(() => msg.responder.error(msg.language.get('COMMAND_REACTIONROLE_NOMSG', _id)));
		} else if (action === "remove") {

			const newReactionRoles = reactionRoles.filter(item => !filter(item));

			msg.guild.settings.update('mod.roles.reactionRoles', newReactionRoles, { arrayAction: 'overwrite' });

			msg.responder.success(msg.language.get('COMMAND_REACTIONROLE_ROLE_REMOVED'));
		}
		
		return
	}

};
