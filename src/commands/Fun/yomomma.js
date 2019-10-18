const { Command } = require('klasa');
const req = require('centra-aero');
const { bold } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['yomama'],
			description: language => language.get('COMMAND_YOMAMMA_DESCRIPTION')
		});
	}

	async run(msg) {
		const { json } = await req('https://api.yomomma.info').send();
		return msg.sendMessage(bold`📢 Yomomma joke: *${json.joke}*`);
	}

};
