const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(data) {
		const guild = this.client.guilds.get(data.message.guild);
		if (!guild || !guild.settings.get('mod.anti.spam')) return;
		if (data.scores.overall > 85) {
			guild.channels
				.get(data.message.channel).messages
				.get(data.message.id)
				.delete()
				.catch(() => null);
		}
	}

};
