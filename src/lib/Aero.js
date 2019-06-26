const { Client } = require('klasa');
Client.use(require('klasa-member-gateway'));

const { klasa, discord } = require('../../config/index');
const Permissions = require('./Permissions');
require('./extensions/Message');
require('./extensions/Channel');
require('./settings');


module.exports = class Aero extends Client {

	constructor() {
		super({ ...klasa, ...discord });

		this.permissions = new Permissions(this);
	}

};
