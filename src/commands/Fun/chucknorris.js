const { Command } = require('klasa');
const { AllHtmlEntities } = require('html-entities');
const superagent = require('superagent');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			bucket: 2,
			cooldown: 4,

			description: language => language.get('COMMAND_CHUCKNORRIS_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_CHUCKNORRIS_EXTENDEDHELP')
		});
	}

	async run(msg) {
		const { body } = await superagent.get('https://api.icndb.com/jokes/random');
		return msg.sendMessage(`📢 Chuck Norris joke: **${new AllHtmlEntities().decode(body.value.joke)}**`);
	}

};
