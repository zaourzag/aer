const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Rates the mentioned user.',
			usage: '<user:user>'
		});
	}

	async run(msg, [user]) {
		return msg.send(`I rate ${user} **${Math.round(Math.random() * 100)}/100**!`);
	}

};
