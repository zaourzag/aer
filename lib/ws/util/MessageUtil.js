const Message = require('../Message');

class MessageUtil {

	static encode(message) {
		return JSON.stringify(message);
	}

	static decode(message) {
		const parsed = JSON.parse(message);
		return new Message(parsed.t, parsed.d);
	}

}

module.exports = MessageUtil;
