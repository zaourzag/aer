const { Client } = require('klasa');
const { klasa, discord, aero } = require('../config/index');
const Permissions = require('./Permissions');
Client.use(require('klasa-member-gateway'));
require('./extensions/Message');
require('./extensions/Channel');
require('./extensions/Guild');
require('./extensions/GuildMember');
require('./settings');

class Aero extends Client {

	constructor(manager) {
		super({ ...klasa, ...discord });
		this.manager = manager;
		this.permissions = new Permissions(this);
		this.config = aero;
	}

	login({ totalShardCount }) {
		this.options.shards = [this.manager.id];
		this.options.totalShardCount = totalShardCount;
		super.login();
	}

}

module.exports = Aero;
