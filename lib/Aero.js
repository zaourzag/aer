const { Client } = require('klasa');
Client.use(require('klasa-member-gateway'));

const { klasa, discord } = require('../config/index');
const Permissions = require('./Permissions');
require('./extensions/Message');
require('./extensions/Channel');
require('./settings');

class Aero extends Client {

	constructor(manager) {
		super({ ...klasa, ...discord });
		this.manager = manager;
		this.permissions = new Permissions(this);
	}

	login({ totalShardCount }) {
		this.options.shards = [this.manager.id];
		this.options.totalShardCount = totalShardCount;
		super.login();
	}

}

module.exports = Aero;
