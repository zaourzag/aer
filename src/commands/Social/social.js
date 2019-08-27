const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_SOCIAL_DESCRIPTION'),
			runIn: ['text'],
			usage: '[toggle|levelmessages]',
			subcommands: true
		});

		this.defaultPermissions = FLAGS.ADMINISTRATOR;
	}

	async toggle(msg) {
		const { enabled } = msg.guildSettings.social;
		await msg.guildSettings.update('social.enabled', !enabled);
		return msg.responder.success(msg.language.get('COMMAND_SOCIAL_TOGGLE_SOCIAL', enabled));
	}

	async levelmessages(msg) {
		await msg.guildSettings.update('social.levelupMessages', !msg.guildSettings.social.levelupMessages);
		return msg.responder.success(msg.language.get('COMMAND_SOCIAL_TOGGLE_LEVELS', msg.guildSettings.social.levelupMessages));
	}

	async run(msg) {
		const { enabled } = msg.guildSettings.social;
		return msg.send(msg.language.get('COMMAND_SOCIAL_STATUS', enabled));
	}

};
