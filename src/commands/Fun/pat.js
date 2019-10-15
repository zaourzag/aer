const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const req = require('centra');
const { NekoAPI } = require('../../../lib/util/constants').url;
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PAT_DESCRIPTION'),
			usage: '<user:username>',
			requiredPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg, [user]) {
		const result = await req(NekoAPI)
        .path('pat')
        .send()
        .then(res => res.json);
		if (user === msg.author) {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_PAT_SELF', user))
				.setImage(result.url)
			);
		} else {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get('COMMAND_PAT_SOMEONE', msg.author, user))
				.setImage(result.url)
			);
		}
	}

};
