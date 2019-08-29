const { Structures } = require('discord.js');
const Connect4 = require('../games/Connect4');
const connect4s = new Map();

Structures.extend('TextChannel', Channel => {
	class AeroChannel extends Channel {

		get connect4() {
			return connect4s.has(this.id) ? connect4s.get(this.id) : connect4s.set(this.id, new Connect4(this)).get(this.id);
		}

	}

	return AeroChannel;
});
