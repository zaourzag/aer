/* eslint-disable */
const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false,
			emitter: 'ws'
		});
	}

	async run(data) {
		// TODO
	}

};
