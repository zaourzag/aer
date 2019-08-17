const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Kiss somebody you really like.',
			usage: '<user:username>',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg, [user]) {
		const result = await superagent.get('https://nekos.life/api/v2/img/kiss');
		if (user === msg.author) {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(`${user} kissed themselves. I have no idea how and why.`)
				.setImage(result.body.url)
			);
		} else {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(`${msg.author} gave ${user} a kiss. How cute. :two_hearts:`)
				.setImage(result.body.url)
			);
		}
	}

};
