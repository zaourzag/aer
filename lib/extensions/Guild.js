const { Structures } = require('discord.js');
const GuildLogger = require('../GuildLogger');

Structures.extend('Guild', Guild => {
	class AeroGuild extends Guild {

		constructor(...args) {
			super(...args);
			this.log = new GuildLogger(this);
			this.modCache = new Set();
		}

	}

	return AeroGuild;
});
