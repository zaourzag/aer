const { Command } = require('klasa');
const superagent = require('superagent');

const { imgflip } = require('../../../config');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 3,
			description: 'Generates an expanding brain meme from a group of sentences.',
			extendedHelp: 'Separate the sentances using commas.',

			usage: '<sentences:str> [...]',
			usageDelim: ', '
		});
	}

	async run(msg, [...sentences]) {
		sentences = sentences.slice(0, 4);
		let url = `https://api.imgflip.com/caption_image?username=${imgflip.username}&password=${imgflip.password}&template_id=${BRAIN_MEME_ID}`;
		for (let i = 0; i < sentences.length; i++) {
			url += `&boxes[${i}][text]=${encodeURIComponent(sentences[i])}`;
		}
		const { body } = await superagent.get(url);
		if (!body.success) throw `An error occurred: ${body.error_message}`;
		return msg.channel.sendFile(body.data.url);
	}

};

const BRAIN_MEME_ID = 93895088;
