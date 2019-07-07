const Client = require('ws');
const EventHandler = require('./event/EventHandler');
const MessageUtil = require('./util/MessageUtil');
const Message = require('./Message');
const { IDENTIFY_CLIENT, RECONNECT_CLIENT } = require('./util/constants').types;

class Websocket extends Client {

	constructor(client) {
		super(`${process.env.WS_PROTOCOL.toLowerCase()}://${process.env.WS_HOST}:${process.env.WS_PORT}`);
		this.client = client;
		this.handler = new EventHandler(client);
		this.on('open', () => {
			console.log('[Websocket] Opened connection');
			if (this.client.client.ready) {
				this.send(MessageUtil.encode(new Message(RECONNECT_CLIENT, { id: this.client.id })));
			} else {
				this.send(MessageUtil.encode(new Message(IDENTIFY_CLIENT, { id: this.client.id })));
			}
		});
	}

	init() {
		this.handler.init();

		this.on('message', message => {
			this.handler.handle(message);
		});
	}

}

module.exports = Websocket;
