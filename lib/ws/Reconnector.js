const Websocket = require('./Websocket');
const { IDLE, RECONNECTING } = require('./util/constants').states;

class Reconnector {

	constructor(client, { timeout = 5000 }) {
		this.client = client;
		this.timeout = timeout;
		this.state = IDLE;
		this.interval = null;
	}

	handleOpen() {
		if (this.state === RECONNECTING) {
			clearInterval(this.interval);
			console.log('reconnected');
			this.state = IDLE;
		}
	}

	handleClose(code, reason) {
		if (this.state === IDLE) {
			console.log(code, reason);
			this.interval = setInterval(() => { this.reconnect(); }, this.timeout);
		}
	}

	handleError(error) {
		if (error.code === 'ECONNREFUSED') {
			if (this.state === IDLE) {
				this.interval = setInterval(() => { this.reconnect(); }, this.timeout);
			}
		} else {
			console.log(error);
		}
	}

	reconnect() {
		console.log('[Reconnector] Reconnecting to websocket ...');
		this.state = RECONNECTING;
		this.client.ws = new Websocket(this.client);
		this.client.init();
		console.log(`[Reconnector] Trying to reconnect again in ${this.timeout} ms ...`);
	}

}

module.exports = Reconnector;
