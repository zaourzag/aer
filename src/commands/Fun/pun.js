const { Command } = require('klasa');
const superagent = require('superagent');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['dadjoke'],
			description: language => language.get('COMMAND_PUN_DESCRIPTION')
		});
	}

	async run(msg) {
		const { body } = await superagent
			.get('http://icanhazdadjoke.com')
			.set('Accept', 'application/json')
			.catch(() => { throw msg.language.get('COMMAND_PUN_APIDOWN'); });
		return msg.sendMessage(msg.language.get('COMMAND_PUN_REPLY', body.joke));
	}

};
