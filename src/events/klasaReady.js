const { Event } = require('klasa');
const { encode } = require('../../lib/ws/util/MessageUtil');
const Message = require('../../lib/ws/Message');
const { READY_CLIENT } = require('../../lib/ws/util/constants').types;

module.exports = class extends Event {

	async run() {
		await this.client.chatwatch.login();
		this.client.chatwatch.ws.on('error', error => this.client.console.error(`[CW] ${error}`));
		this.client.console.log('Connected to ChatWatch.');
		if (process.env.BOOT_SINGLE !== 'false') return;
		this.client.manager.ws.send(encode(new Message(READY_CLIENT, { id: this.client.manager.id })));
	}

};
