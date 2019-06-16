const { Structures } = require('discord.js');
const Responder = require('../Responder');

Structures.extend('Message', Message => {
	class AeroMessage extends Message {

		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
		}

	}
	return AeroMessage;
});
