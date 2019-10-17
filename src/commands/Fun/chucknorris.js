const { Command } = require('klasa');
const { AllHtmlEntities } = require('html-entities');
const req = require('centra-aero');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			bucket: 2,
			cooldown: 4,
			description: language => language.get('COMMAND_CHUCKNORRIS_DESCRIPTION')
		});
	}

	async run(msg) {
		const { json } = await req('https://api.icndb.com/jokes/random').send();
		return msg.sendMessage(`📢 Chuck Norris joke: **${new AllHtmlEntities().decode(json.value.joke)}**`);
	}

};
