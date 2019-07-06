const Aero = require('./Aero');
const Websocket = require('./ws/Websocket');
const os = require('os');

module.exports = class Manager {

	constructor() {
		this.id = process.env.NODE_ENV === 'production' ? Number(os.hostname().split('-').pop()) : 1;
		this.ws = new Websocket(this);
		this.client = new Aero(this);
	}

	init() {
		this.ws.init();
		if (process.env.BOOT_SINGLE) {
			this.client.login({ totalShardCount: 1 });
		}
	}

	launch(data) {
		this.client.login(data);
	}

};
