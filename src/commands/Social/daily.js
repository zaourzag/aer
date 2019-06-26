const { Command, Duration, constants: { TIME } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Claim your daily points!',
			extendedHelp: 'Add a --reminder flag at the end of the command to be reminded of next dailies in 12 hours.',

			runIn: ['text']
		});

		this.requireSocial = true;
	}

	async run(msg) {
		const member = await msg.guild.members.fetch(msg.author);
		await member.settings.sync(true);
		if (Date.now() - member.settings.dailyTime < TIME.HOUR * 12) {
			return msg.send(`You've already collected your daily reward. You can collect it again in ${Duration.toNow(member.settings.dailyTime + (TIME.HOUR * 12))}`);
		}
		// WIP: double points for upvotes?
		const points = 50;

		await msg.member.settings.update([['points', msg.member.settings.points + points], ['dailyTime', Date.now()]]);
		await msg.author.settings.update('trivia', msg.author.settings.trivia + points);
		if (msg.flags.remind || msg.flags.reminder || msg.flags.remindme) {
			await this.client.schedule.create('reminder', Date.now() + (TIME.HOUR * 12), {
				data: {
					channel: msg.channel.id,
					user: msg.author.id,
					text: 'Collect daily reward.'
				}
			});
		}
		return msg.responder.success('You succesfully collected your daily reward!');
	}

};
