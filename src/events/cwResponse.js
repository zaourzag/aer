const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(data) {
		if (data.scores.overall > 85)
			this.client.channels
				.get(data.message.channel).messages
				.get(data.message.id)
				.delete()
				.catch(() => null);
	}
}
