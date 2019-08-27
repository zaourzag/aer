const Aero = require('./Aero');
const Websocket = require('./ws/Websocket');
const Reconnector = require('./ws/Reconnector');
const express = require('express');
const os = require('os');
const winston = require('winston');

module.exports = class Manager {

	constructor() {
		this.id = process.env.NODE_ENV === 'production' ? Number(os.hostname().split('-').pop()) : 0;
		this.log = winston.createLogger({
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ level, message, timestamp }) => `[${timestamp.split('T')[1].split('.')[0]}] [${level.toUpperCase()}] ${message.trim()}`)
			),
			transports: [new winston.transports.Console()]
		});
		if (!process.env.BOOT_SINGLE) {
			this.ws = new Websocket(this);
			this.reconnector = new Reconnector(this);
			this.api = express();
			this.api.listen(process.env.PROBES_API_PORT, () => this.log.info(`Probes API is listening on ${process.env.PROBES_API_PORT}`));
		}
		this.client = new Aero(this);
		this.listen();
	}

	init() {
		if (process.env.BOOT_SINGLE) return;
		this.ws.init();

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

	listen() {
		if (process.env.BOOT_SINGLE) {
			return this.client.login({ totalShardCount: 1 });
		}

		this.api.get('/health', (req, res) => {
			res.status(200).end();
		});

		this.api.get('/ready', (req, res) => {
			if (this.client.ready) {
				res.status(200).end();
			} else {
				res.status(400).end();
			}
		});

		this.api.get('/shutdown', (req, res) => {
			this.client.log.info('Shutting down ...');
			res.status(200).end();
		});
	}

	launch(data) {
		this.client.login(data);
	}

};
