const Websocket = require('./Websocket');
const { IDLE, RECONNECTING } = require('./util/constants').states;

class Reconnector {

	constructor(client, timeout = 5000) {
		this.client = client;
		this.timeout = timeout;
		this.state = IDLE;
		this.interval = null;
		console.log('recon.constructor')
	}

	handleOpen() {
		if (this.state === RECONNECTING) {
			clearInterval(this.interval);
			this.client.console.log('Reconnected to Aether!');
			this.state = IDLE;
		}
		console.log('recon.open')
	}

	handleClose() {
		if (this.state === IDLE) {
			this.client.console.warn('Disconnected from Aether!');
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
		this.client.console.log(`Reconnecting to Aether with ${this.timeout}ms timeout ...`);
		this.state = RECONNECTING;
		this.client.ws = new Websocket(this.client);
		this.client.init();
	}

}

module.exports = Reconnector;
