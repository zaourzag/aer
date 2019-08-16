const Aero = require('./Aero');
const Websocket = require('./ws/Websocket');
const Reconnector = require('./ws/Reconnector');
const os = require('os');
const winston = require('winston');

module.exports = class Manager {

	constructor() {
		this.id = process.env.NODE_ENV === 'production' ? Number(os.hostname().split('-').pop()) : 1;
		this.log = winston.createLogger({
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ level, message, timestamp }) => `[${timestamp.split('T')[1].split('.')[0]}] [${level.toUpperCase()}] ${message.trim()}`)
			),
			transports: [new winston.transports.Console()]
		});
		this.ws = new Websocket(this);
		this.reconnector = new Reconnector(this);
		this.client = new Aero(this);
	}

	init() {
		this.ws.init();

		if (process.env.BOOT_SINGLE) {
			this.client.login({ totalShardCount: 1 });
		}

		this.ws.on('open', () => {
			this.reconnector.handleOpen();
		});

		this.ws.on('close', (code, reason) => {
			this.reconnector.handleClose(code, reason);
		});

		this.ws.on('error', error => {
			this.reconnector.handleError(error);
		});
	}

	launch(data) {
		this.client.login(data);
	}

};
