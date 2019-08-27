const { Command } = require('klasa');
const superagent = require('superagent');
const { bold } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['yomama'],
			description: language => language.get('COMMAND_YOMAMMA_DESCRIPTION')
		});
	}

	async run(msg) {
		const { text } = await superagent.get('http://api.yomomma.info');
		return msg.sendMessage(bold`📢 Yomomma joke: *${JSON.parse(text).joke}*`);
	}

};
