const { Client } = require('klasa');
const { KSoftClient } = require('ksoft.js');
const { klasa, discord, aero } = require('../config');
const Permissions = require('./Permissions');
Client.use(require('klasa-member-gateway'));
require('./extensions');
require('./settings');

class Aero extends Client {

	constructor(manager) {
		super({ ...klasa, ...discord });
		this.manager = manager;
		this.permissions = new Permissions(this);
		this.config = aero;
		this.ksoft = new KSoftClient(process.env.KSOFT_TOKEN);
	}

	login({ totalShardCount }) {
		this.options.shards = [this.manager.id];
		this.options.totalShardCount = totalShardCount;
		super.login();
	}

}

module.exports = Aero;
