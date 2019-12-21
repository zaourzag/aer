const EventStore = require('./EventStore');
const MessageUtil = require('../util/MessageUtil');

class EventHandler {

	constructor(client) {
		this.client = client;
		this.store = new EventStore(client);
		console.log('evh.constructor')
	}

	init() {
		this.store.init();
		console.log('evh.init')
	}

	handle(message) {
		const decoded = MessageUtil.decode(message);
		const event = this.store.get(decoded.type);

		if (event === null) {
			throw new TypeError(`Event type "${decoded.type}" not found!`);
		}

		event.run(decoded.data);
		console.log('evh.handle')
	}

}

module.exports = EventHandler;
