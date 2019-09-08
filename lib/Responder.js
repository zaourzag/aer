const { error, success } = require('./util/constants').emojis;

class Responder {

	constructor(message) {
		this.message = message;
	}

	success(text) {
		return this.message.send(`${success} ${text}`);
	}

	error(text) {
		return this.message.send(`${error} ${text}`);
	}

}

module.exports = Responder;
