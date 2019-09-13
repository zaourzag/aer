const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['b', 'bean', '410'],
			description: '',
			usage: '<user:user>',
			usageDelim: ' '
		});
	}

	async run(msg, [user]) {
		msg.responder.error(`**WIP** debug: user = ${user.id}`);
	}


};
