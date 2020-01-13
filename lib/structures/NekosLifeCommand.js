const { Command } = require('klasa');
const req = require('@aero/centra');
const { NekoAPI } = require('../util/constants').url;
const { MessageEmbed } = require('discord.js');

class NekosLifeCommand extends Command {

	constructor(name, ...args) {
		super(...args, {
			description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
			usage: '<user:username>',
			requiredPermissions: ['EMBED_LINKS']
		});

		this.name = name;
	}

	async run(msg, [user]) {
		const result = await req(NekoAPI)
			.path(this.name)
			.send()
			.then(res => res.json);
		if (user === msg.author) {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get(`COMMAND_${this.name.toUpperCase()}_SELF`, user))
				.setImage(result.url)
			);
		} else {
			return msg.sendEmbed(new MessageEmbed()
				.setDescription(msg.language.get(`COMMAND_${this.name.toUpperCase()}_SOMEONE`, msg.author, user))
				.setImage(result.url)
			);
		}
	}

}

module.exports = NekosLifeCommand;
