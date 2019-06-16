const { MessageEmbed, Permissions: { FLAGS } } = require('discord.js');
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_INVITE_DESCRIPTION')
		});
	}

	async run(message) {
		return !message.guild.me.permissions.has(FLAGS.EMBED_LINKS) ?
			message.sendLocale('COMMAND_INVITE') :
			message.sendEmbed(new MessageEmbed()
				.setAuthor(this.client.user.username, this.client.user.avatarURL())
				.setDescription(`[Invite Aero](${this.client.invite}) | [Support Server]( https://discord.gg/vn9waRs)`)
			);
	}

};
