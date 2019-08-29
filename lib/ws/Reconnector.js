const Websocket = require('./Websocket');
const { IDLE, RECONNECTING } = require('./util/constants').states;

class Reconnector {

	constructor(client, timeout = 5000) {
		this.client = client;
		this.timeout = timeout;
		this.state = IDLE;
		this.interval = null;
	}

	handleOpen() {
		if (this.state === RECONNECTING) {
			clearInterval(this.interval);
			this.client.log.info('Successfully reconnected to Aether!');
			this.state = IDLE;
		}
	}

	handleClose() {
		if (this.state === IDLE) {
			this.client.log.warn('Got disconnected from Aether!');
			this.activate();
		}
	}

	handleError(error) {
		if (error.code === 'ECONNREFUSED') {
			if (this.state === IDLE) {
				this.activate();
			}
		} else {
			console.log(error);
		}
	}

	activate() {
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			this.reconnect();
		}, this.timeout);
	}

	reconnect() {
		this.client.log.info(`Reconnecting to Aether with ${this.timeout}ms timeout ...`);
		this.state = RECONNECTING;
		this.client.ws = new Websocket(this.client);
		this.client.init();
	}

}

module.exports = Reconnector;
