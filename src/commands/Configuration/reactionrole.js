/* eslint-disable */
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
			usage: '<add|remove> [channel:channel] <messageid:string{17,18}> <emote:str> <role:rolename>',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
		this.deprecated = 'Currently in development';
	}

	async run(msg, [action, channel = msg.channel, _id, emote, role]) {
		const message = channel.messages.get(_id);
		if (!message) return msg.responder.error(msg.language.get('COMMAND_REACTIONROLE_NOMSG'));
		await message.react(emote);
		console.log(emote);
		return msg.responder.success();
	}

};
