const { Command, Duration, constants: { TIME } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_DAILY_DESCRIPTION'),
			runIn: ['text']
		});

		this.requireSocial = true;
	}

	async run(msg) {
		const member = await msg.guild.members.fetch(msg.author);
		await member.settings.sync(true);
		if (Date.now() - member.settings.get('lastDailyTimestamp') < TIME.HOUR * 12) {
			return msg.send(msg.language.get('COMMAND_DAILY_COOLDOWN', Duration.toNow(member.settings.get('lastDailyTimestamp') + (TIME.HOUR * 12))));
		}
		const points = this.client.config.dailyPoints;

		await msg.member.settings.update([['points', msg.member.settings.get('points') + points], ['lastDailyTimestamp', Date.now()]]);
		if (msg.flagArgs.remind || msg.flagArgs.reminder || msg.flagArgs.remindme) {
			await this.client.schedule.create('reminder', Date.now() + (TIME.HOUR * 12), {
				data: {
					channel: msg.channel.id,
					user: msg.author.id,
					text: msg.language.get('COMMAND_DAILY_REMINDER')
				}
			});
		}
		return msg.responder.success(msg.language.get('COMMAND_DAILY_REPLY'));
	}

};
