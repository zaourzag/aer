const { Command, Duration, Timestamp } = require('klasa');
const { MessageEmbed, User, Role, Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'role', 'i'],
			description: language => language.get('COMMAND_INFO_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'VIEW_AUDIT_LOG'],
			usage: '[user:username|role:rolename|server]'
		});

		this.timestamp = new Timestamp('dddd, MMMM d YYYY');
	}

	async run(msg, [arg]) {
		if (arg instanceof User) return this.userinfo(msg, arg);
		if (arg instanceof Role) return this.roleinfo(msg, arg);
		if (msg.guild && arg === 'server') return this.serverinfo(msg);
		return this.botinfo(msg);
	}

	async userinfo(msg, user) {
		const member = msg.guild ? await msg.guild.members.fetch(user) : null;
		const creator = member && (member.joinedTimestamp - msg.guild.createdTimestamp) < 3000;
		const { activity } = user.presence;
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag} [${user.id}]`, user.avatarURL())
			.setThumbnail(user.avatarURL())
			.setColor(member ? member.displayColor : 'RANDOM')
			.setDescription(msg.language.get('COMMAND_INFO_USER_DISCORDJOIN', this.timestamp.display(user.createdAt), Duration.toNow(user.createdAt)))
		// add guild specific info if in a guild
		if (member) {
			embed.description += msg.language.get(
				creator ? 'COMMAND_INFO_USER_GUILDRCEATE' : 'COMMAND_INFO_USER_GUILDJOIN',
				msg.guild.name,
				this.timestamp.display(member.joinedAt),
				Duration.toNow(member.joinedAt));

			const roles = member.roles.sort((a, b) => b.position - a.position);
			const roleString = roles
				.array()
				.reduce((acc, role, idx) => acc.length + role.name.length < 1010 && role.id !== msg.guild.id
					? acc + (idx !== 0 ? ', ' : '') + role.name
					: acc,
					'');

			console.log(roleString, roleString.length);
			if (roles.size) {
				embed.addField(
					`• Role${roles.size > 2 ? `s (${roles.size - 1})` : roles.size === 2 ? '' : 's'}`, roleString.length ? roleString : msg.language.get('COMMAND_INFO_USER_NOROLES'));
			}
		}
		// add activity specific info
		if (activity) {
			embed.addField('• Other', `Activity: ${msg.language.get(`ACTIVITY_${activity.type}`)} ${activity}`);
		}
		return msg.sendEmbed(embed);
	}

	roleinfo(msg, role) {
		return msg.send(role.name);
	}

	serverinfo(msg) {
		return msg.send(msg.guild.name);
	}

	botinfo(msg) {
		if (msg.guild && !msg.guild.me.permissions.has(FLAGS.EMBED_LINKS)) return msg.sendLocale('COMMAND_INFO_BOT');
		return msg.sendEmbed(new MessageEmbed()
			.setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
			.setDescription(msg.language.get('COMMAND_INFO_BOT'))
		);
	}

};
