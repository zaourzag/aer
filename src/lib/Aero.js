const { Client } = require('klasa');

const { klasa, discord, aero } = require('../../config/index');
const Permissions = require('./Permissions');
require('./extensions/Message');
require('./settings');


module.exports = class Aero extends Client {

	constructor() {
		super({ ...klasa, ...discord });

		this.permissions = new Permissions(this);
	}

	login() {
		const token = process.env[`DISCORD_TOKEN${aero.production ? '' : '_DEV'}`];
		super.login(token);
	}

};
