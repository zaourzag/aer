const { Command } = require('klasa');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Give away fancy stuff!',
			usage: '<duration:time> <price:str> [...]',
			usageDelim: ' ',
			cooldown: 10
		});
	}

	async run(msg, [time, ...price]) {
		price = price.join(' ');
		const winners = msg.flags.winners || 1;
		if (winners > 20) return msg.responder.error(`${winners} is larger than the maximum of 20 winners allowed.`);

		const m = await msg.responder.info(`🎊 Giveaway by ${msg.author.tag}! 🎊`, `${winners > 1 ? `${winners} x ` : ''}**${price}**`, `react below to enter | ends ${moment.utc(time).format('Do MMM H:mm')} UTC`);
		await m.react('🎉');

		await this.client.schedule.create('endgiveaway', time, {
			data: {
				message: m.id,
				channel: m.channel.id,
				author: msg.author.id,
				price,
				winners
			}
		});
	}

};
