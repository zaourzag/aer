const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_KISS_DESCRIPTION'),
			usage: '<user:username>',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg, [user]) {
		const result = await superagent.get('https://nekos.life/api/v2/img/kiss');
		if (user === msg.author) {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_KISS_SELF', user))
				.setImage(result.body.url)
			);
		} else {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_KISS_SOMEONE', msg.author, user))
				.setImage(result.body.url)
			);
		}
	}

};
