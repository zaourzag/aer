const { Command, Duration, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'ui'],
			description: language => language.get('COMMAND_USERINFO_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS'],
			usage: '[user:username]'
		});

		this.timestamp = new Timestamp('dddd, MMMM d YYYY');
	}

	async run(msg, [user = msg.author]) {
		const member = msg.guild ? await msg.guild.members.fetch(user) : null;
		const creator = member && (member.joinedTimestamp - msg.guild.createdTimestamp) < 3000;
		const { activity } = user.presence;
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag} [${user.id}]`, user.avatarURL())
			.setThumbnail(user.avatarURL())
			.setColor(member ? member.displayColor : 'RANDOM')
			.setDescription(msg.language.get('COMMAND_USERINFO_JOINED_DISCORD', this.timestamp.display(user.createdAt), Duration.toNow(user.createdAt)))
			.setFooter(this.client.user.username, this.client.user.avatarURL())
			.setTimestamp();
		// add guild specific info if in a guild
		if (member) {
			embed.description += msg.language.get(creator ? 'COMMAND_USERINFO_CREATED_GUILD' : 'COMMAND_USERINFO_JOINED_GUILD', msg.guild.name, this.timestamp.display(member.joinedAt), Duration.toNow(member.joinedAt));
			const roles = member.roles.sort((a, b) => b.position - a.position);
			if (roles.size) {
				embed.addField(
					`• Role${roles.size > 1 ? `s (${roles.size})` : ''}`,
					roles
						.array()
						.reduce((acc, role, idx) => acc.length + role.name.length < 1010 && role.id !== msg.guild.id
							? acc + (idx !== 0 ? ', ' : '') + role.name
							: acc,
							''));
			}
		}
		// add activity specific info
		if (activity) {
			embed.addField('• Other', `Activity: ${msg.language.get(`ACTIVITY_${activity.type}`)} ${activity}`);
		}
		return msg.sendEmbed(embed);
	}

};
