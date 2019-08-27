const { Event } = require('klasa');
const MessageUtil = require('../../lib/ws/util/MessageUtil');
const Message = require('../../lib/ws/Message');
const { READY_CLIENT } = require('../../lib/ws/util/constants').types;

module.exports = class extends Event {

	async run() {
		if (process.env.BOOT_SINGLE) return;
		this.client.manager.ws.send(MessageUtil.encode(new Message(READY_CLIENT, { id: this.client.manager.id })));
	}

};
