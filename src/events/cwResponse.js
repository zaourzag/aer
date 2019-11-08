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
		const user = await this.client.users.fetch(data.user.user);
		if (data.user.blacklisted && !user.settings.get('chatwatch.blacklisted')) {
			user.settings.update('chatwatch.blacklisted', true);
			user.settings.update('chatwatch.blacklistedReason', data.user.blacklisted_reason);
		}
		return user.settings.update('chatwatch.score', data.user.score);

	}
}
