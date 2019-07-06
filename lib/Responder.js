class Responder {

	constructor(message) {
		this.message = message;
	}

	success(text) {
		return this.message.send(`${Responder.emojis.success} ${text}`);
	}

	error(text) {
		return this.message.send(`${Responder.emojis.error} ${text}`);
	}

}

Responder.emojis = {
	error: '<:mCross:589499156637417483>',
	success: '<:mCheck:589498583364009995>'
};

module.exports = Responder;
