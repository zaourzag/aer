const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const req = require('centra-aero');
const util = require('../../../lib/util/constants');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_FEED_DESCRIPTION'),
			usage: '<user:username>',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg, [user]) {
		const result = await req(util.url.NekoAPI)
			.path('feed')
			.send()
			.then(res => res.json);
		if (user === msg.author) {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_FEED_SELF', user))
				.setImage(result.url)
			);
		} else {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_FEED_SOMEONE', msg.author, user))
				.setImage(result.url)
			);
		}
	}

};