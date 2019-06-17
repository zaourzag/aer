const { Command } = require('klasa');
const superagent = require('superagent');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Sends a random pun.',
			extendedHelp: 'Powered by http://icanhazdadjoke.com'
		});
	}

	async run(msg) {
		const { body } = await superagent
			.get('http://icanhazdadjoke.com')
			.set('Accept', 'application/json')
			.catch(() => { throw 'The API appears to be down. Try again later!' });
		return msg.sendMessage(`Random pun: **${body.joke}**`);
	}

};
