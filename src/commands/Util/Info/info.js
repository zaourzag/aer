const { Command } = require('klasa');
const { MessageEmbed, Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			guarded: true,
			description: language => language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(message) {
		if (!message.guild.me.permissions.has(FLAGS.EMBED_LINKS)) return message.sendLocale('COMMAND_INFO');
		return message.sendEmbed(new MessageEmbed()
			.setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
			.setDescription(message.language.get('COMMAND_INFO'))
		);
	}

};
