const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const c = require('centra');
const util = require('../../../lib/util/constants');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_HUG_DESCRIPTION'),
			usage: '<user:username>',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg, [user]) {
		const result = await c(util.url.NekoAPI)
        .path('hug')
        .send()
        .then(res => res.json);
		if (user === msg.author) {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_HUG_SELF', user))
				.setImage(result.url)
			);
		} else {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_HUG_SOMEONE', msg.author, user))
				.setImage(result.url)
			);
		}
	}

};
