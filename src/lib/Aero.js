const { Client } = require('klasa');

const { clientOptions } = require('../../config/index');
const Permissions = require('./Permissions');
require('./extensions/Message');


module.exports = class Aero extends Client {

	constructor() {
		super(clientOptions);

		this.permissions = new Permissions(this);
	}

	login () {
		const token = process.env[`DISCORD_TOKEN${aero.production ? '' : '_DEV'}`];
		super.login(token); 
	}

};
