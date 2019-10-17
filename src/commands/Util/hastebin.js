const { Command } = require('klasa');
const req = require('centra-aero');

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
		const { key } = await req(url, 'POST')
			.path('documents')
			.body(code)
			.send()
			.then(res => res.json);
		return msg.send(`${url}/${key}`);
	}

};
