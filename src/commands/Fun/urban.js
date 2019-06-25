const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Searches the urban dictionary for the definition to a search term.',
			usage: '<searchTerm:str> [result:int]',
			usageDelim: ', ',
			cooldown: 5,
			requiredPermissions: ['EMBED_LINKS'],
			aliases: ['ud'],
			nsfw: true
		});

		this
			.customizeResponse('searchTerm', 'What would you like to search?');
	}

	splitText(str, length) {
		const dx = str.substring(0, length).lastIndexOf(' ');
		const pos = dx === -1 ? length : dx;
		return str.substring(0, pos);
	}

	async run(msg, [search, resultNum = 0]) {
		const url = `http://api.urbandictionary.com/v0/define?term=${search}`;
		const body = await superagent.get(url).then(data => data.body);
		if (resultNum > 1) resultNum--;

		const result = body.list[resultNum];
		if (!result) throw msg.language.get('COMMAND_URBAN_MAX', body.list.length);
		const wdef = result.definition.length > 1000 ?
			`${this.splitText(result.definition, 1000)}...` :
			result.definition;
		return msg.sendEmbed(new MessageEmbed()
			.setTitle(result.word)
			.setDescription(`${wdef}\n\n\`👍\` ${result.thumbs_up}\n\`👎\` ${result.thumbs_down}`)
			.setURL(result.permalink)
			.setColor(16586)
			.setThumbnail('http://i.imgur.com/qNTzb3k.png')
			.setFooter(`By ${result.author}`)
			.addField('Example', `*${this.splitText(result.example, 1000)}...*`));
	}

};
