const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(message) {
		if (!message.guild) return false;
		return message.guild.log.messageDeleted({ user: message.author, message });
	}

};
