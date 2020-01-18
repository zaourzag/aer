/*
 * Author: William Johnstone <william@endevrr.com>
 * Credit example: Credit goes to [William Johnstone](https://endevrr.com). (c) [The Aero Team](https://aero.bot) 2020
 */
const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['rero', 'reactionroles'],
			description: language => language.get('COMMAND_REACTIONROLE_DESCRIPTION'),
			usage: '<add|remove> [channel:channel] <messageid:string{17,18}> <emote:emoji> [role:rolename]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [action, channel = msg.channel, messageID, emote, role]) {

		const reactionRole = {
			messageID,
			emoteID: emote.id,
			roleID: role.id
		}

		const filter = (item) => {
			return item.messageID === reactionRole.messageID &&
				item.emoteID === reactionRole.emoteID;
		}

		const reactionRoles = msg.guild.settings.get('mod.roles.reactionRoles');

		if (action === "add") {
			if (!role) return msg.responder.error('COMMAND_REACTIONROLE_ROLE_NOEXIST');
			await channel.messages.fetch(messageID).then(message => {
				const equalReactionRoles = reactionRoles.filter(item => filter(item))

				if (equalReactionRoles.length > 0) return msg.responder.error(msg.language.get('COMMAND_REACTIONROLE_ROLE_EXIST'));

				msg.guild.settings.update('mod.roles.reactionRoles', reactionRole, { arrayAction: 'add' })
				message.react(emote.id);
				msg.responder.success(msg.language.get('COMMAND_REACTIONROLE_ROLE_ADDED'));
			}).catch(() => msg.responder.error(msg.language.get('COMMAND_REACTIONROLE_NOMSG', messageID)));
		} else if (action === "remove") {
			const newReactionRoles = reactionRoles.filter(item => !filter(item));
			msg.guild.settings.update('mod.roles.reactionRoles', newReactionRoles, { arrayAction: 'overwrite' });
			msg.responder.success(msg.language.get('COMMAND_REACTIONROLE_ROLE_REMOVED'));
		}

		return
	}

};
