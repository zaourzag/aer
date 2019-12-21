const Aero = require('./Aero');
const Websocket = require('./ws/Websocket');
const Reconnector = require('./ws/Reconnector');
const express = require('express');
const { hostname } = require('os');

module.exports = class Manager {

	constructor() {
		this.id = process.env.NODE_ENV === 'production' ? Number(hostname().split('-').pop()) : 0;
		this.client = new Aero(this);
		if (!process.env.BOOT_SINGLE) {
			this.ws = new Websocket(this);
			this.reconnector = new Reconnector(this);
			this.api = express();
			this.api.listen(process.env.PROBES_API_PORT, () => this.client.console.log(`Probes API is listening on ${process.env.PROBES_API_PORT}`));
		}
		this.listen();
		console.log('man.constructor')
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
		console.log('man.init')
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
			this.client.console.log('Shutting down ...');
			res.status(200).end();
		});
		console.log('man.listen')
		return this.api;
	}

	launch(data) {
		this.client.login(data);
		console.log('man.launch')
	}

};
