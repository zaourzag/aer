const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Configure the economy system of your server, and toggle level up messages.',
			runIn: ['text'],
			usage: '[toggle|levelmessages]',
			subcommands: true
		});

		this.defaultPermissions = FLAGS.ADMINISTRATOR;
	}

	async toggle(msg) {
		const { enabled } = msg.guildSettings.social;
		await msg.guildSettings.update('social.enabled', !enabled);
		return msg.responder.success(`There, **${!enabled ? 'enable' : 'disable'}d** the economy system in this server.`);
	}

	async levelmessages(msg) {
		await msg.guildSettings.update('social.levelupMessages', !msg.guildSettings.social.levelupMessages);
		return msg.responder.success(`There, level up messages in this server are now **${msg.guildSettings.social.levelupMessages ? 'enable' : 'disable'}d**.`);
	}

	async run(msg) {
		const { enabled } = msg.guildSettings.social;
		return msg.send(`The economy system is **${enabled ? 'enable' : 'disable'}d** in this server.`);
	}

};
