const { Client } = require('klasa');

const { klasa, discord } = require('../../config/index');
const Permissions = require('./Permissions');
require('./extensions/Message');
require('./settings');


module.exports = class Aero extends Client {

	constructor() {
		super({ ...klasa, ...discord });

		this.permissions = new Permissions(this);
	}

};
