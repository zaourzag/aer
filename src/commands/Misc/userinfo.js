const { Command, Duration, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'ui'],
			description: 'Shows information about the mentioned user.',
			requiredPermissions: ['EMBED_LINKS'],
			usage: '[user:username]'
		});

		this.timestamp = new Timestamp('dddd, MMMM d YYYY');
	}

	async run(msg, [user = msg.author]) {
		const member = msg.guild ? await msg.guild.members.fetch(user) : null;
		const { activity } = user.presence;
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag} [${user.id}]`, user.avatarURL())
			.setThumbnail(user.avatarURL())
			.setColor(member ? member.displayColor : 'RANDOM')
			.setDescription(`Joined Discord on ${this.timestamp.display(user.createdAt)} (${Duration.toNow(user.createdAt)} ago)`)
			.setFooter(this.client.user.username, this.client.user.avatarURL())
			.setTimestamp();
		// add guild specific info if in a guild
		if (member) {
			embed.description += `\nJoined ${msg.guild.name} on ${this.timestamp.display(member.joinedAt)} (${Duration.toNow(member.joinedAt)} ago)`;
			embed.addField('• Role(s)', member.roles.map(role => role.name).slice(0, -1).sort().join(', ') || 'No roles');
		}
		// add activity specific info
		if (activity) {
			embed.addField('• Other', `Activity: ${ACTIVITY_TYPES[activity.type]} ${activity}`);
		}
		return msg.sendEmbed(embed);
	}

};

const ACTIVITY_TYPES = {
	PLAYING: 'Playing',
	LISTENING: 'Listening to',
	STREAMING: 'Streaming'
};
