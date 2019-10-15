const { Command } = require('klasa');
const centra = require('centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['hb', 'haste'],
			description: language => language.get('COMMAND_HASTEBIN_DESCRIPTION'),
			usage: '<code:str>'
		});
	}

	async run(msg, [code]) {
		const url = this.client.config.hasteURL;
		const { key } = await centra(url, 'POST')
			.path('documents')
			.body(code)
			.send()
			.then(res => res.json);
		return msg.send(`${url}/${key}`);
	}
};
