const { Command } = require('klasa');
const superagent = require('superagent');
const { BRAIN_MEME_ID } = require('../../../lib/util/constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 3,
			description: language => language.get('COMMAND_BRAIN_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_BRAIN_EXTENDEDHELP'),
			usage: '<sentences:str> [...]',
			usageDelim: ', '
		});
	}

	async run(msg, [...sentences]) {
		sentences = sentences.slice(0, 4);
		const { body } = await superagent
			.get('https://api.imgflip.com/caption_image')
			.query({
				username: process.env.IMGFLIP_USER,
				password: process.env.IMGFLIP_PASS,
				template_id: BRAIN_MEME_ID
			})
			.query(
				sentences.reduce((obj, item, i) => {
					obj[`boxes[${i}][text]`] = encodeURIComponent(item);
					return obj;
				}, {})
			);
		if (!body.success) throw msg.language.get('ERROR_GENERIC', body.error_message);
		return msg.channel.sendFile(body.data.url);
	}

};
