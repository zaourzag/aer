const Client = require('ws');
const EventHandler = require('./event/EventHandler');
const MessageUtil = require('./util/MessageUtil');
const Message = require('./Message');
const { IDENTIFY_CLIENT } = require('./util/constants').types;

class Websocket extends Client {

	constructor(client) {
		super(`${process.env.WS_PROTOCOL.toLowerCase()}://${process.env.WS_HOST}:${process.env.WS_PORT}`);
		this.client = client;
		this.handler = new EventHandler(client);
		this.on('open', () => this.send(MessageUtil.encode(new Message(IDENTIFY_CLIENT, { id: this.client.id }))));
	}

	init() {
		this.handler.init();
		this.on('message', message => {
			this.handler.handle(message);
		});
		this.on('close', (code, reason) => {
			console.log(code, reason);
		});
	}

}

module.exports = Websocket;
