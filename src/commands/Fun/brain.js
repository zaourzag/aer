const { Command } = require('klasa');
const req = require('@aero/centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 3,
			description: language => language.get('COMMAND_BRAIN_DESCRIPTION'),
			usage: '<panel1:str> <panel2:str> <panel3:str> <panel4:str>',
			usageDelim: ', '
		});
	}

	async run(msg, [...sentences]) {
		const { body } = await req(this.client.config.memegenURL)
			.header('Authorization', process.env.MEMEGEN_TOKEN)
			.path('brain')
			.query('text', sentences.join(', '))
			.send();
		return msg.channel.sendFile(body);
	}

};
