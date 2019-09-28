const { emojis, reactions } = require('./util/constants');

class Responder {

	constructor(message) {
		this.message = message;
	}

	success(text) {
		if (!text) return this.message.react(reactions.success);
		return this.message.send(`${emojis.success} ${text}`);
	}

	error(text) {
		if (!text) return this.message.react(reactions.error);
		return this.message.send(`${emojis.error} ${text}`);
	}

	lock() { this.message.react(reactions.lock); }

	unlock() { this.message.react(reactions.unlock); }

}

module.exports = Responder;
