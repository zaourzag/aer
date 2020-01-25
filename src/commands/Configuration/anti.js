const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_MESSAGES'],
			aliases: ['automod'],
			description: language => language.get('COMMAND_ANTI_DESCRIPTION'),
			usage: '[invites|duplicates|copypastas|hoisting|unmentionable|toxicity] [enable|disable]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_MESSAGES;
	}

	async run(msg, [type, action]) {
		if (!action) return this.displaySettings(msg, type);
		if (!type) return msg.responder.error('COMMAND_ANTI_NOTYPE');
		await msg.guild.settings.update(`mod.anti.${type}`, action === 'enable');
		return msg.responder.success(msg.language.get('COMMAND_ANTI_SUCCESS', type, action === 'enable', ['hoisting', 'unmentionable'].includes(type)));
	}

	async displaySettings(msg, type) {
		if (type) {
			const enabled = msg.guild.settings.get(`mod.anti.${type}`);
			return msg.send(msg.language.get('COMMAND_ANTI_DISPLAY_ONE', type, enabled));
		} else {
			const out = [];
			for (const anti of ['invites', 'duplicates', 'copypastas', 'hoisting', 'unmentionable', 'spam']) {
				const enabled = msg.guild.settings.get(`mod.anti.${anti}`);
				out.push(msg.language.get('COMMAND_ANTI_DISPLAY_ONE', anti, enabled));
			}
			return msg.send(out.join('\n'));
		}
	}


};
