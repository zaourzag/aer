const { Command } = require('klasa');
const req = require('centra-aero');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['dadjoke'],
			description: language => language.get('COMMAND_PUN_DESCRIPTION')
		});
	}

	async run(msg) {
		const { json } = await req('https://icanhazdadjoke.com')
			.header('Accept', 'application/json')
			.send()
			.catch(() => { throw msg.language.get('COMMAND_PUN_APIDOWN'); });
		return msg.sendMessage(msg.language.get('COMMAND_PUN_REPLY', json.joke));
	}

};
