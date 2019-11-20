const { Command, Duration, Timestamp } = require('klasa');
const { MessageEmbed, GuildMember, User, Role, Permissions: { FLAGS } } = require('discord.js');
const { color: { VERY_NEGATIVE, POSITIVE }, emojis: { error, success }, DServicesBans } = require('../../../lib/util/constants');
const req = require('centra-aero');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'role', 'i'],
			description: language => language.get('COMMAND_INFO_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'VIEW_AUDIT_LOG'],
			usage: '[server|role:rolename|user:membername|userID:str{17,18}]'
		});

		this.timestamp = new Timestamp('MMMM d YYYY');

		this.perms = {
			ADMINISTRATOR: 'Administrator',
			VIEW_AUDIT_LOG: 'View Audit Log',
			MANAGE_GUILD: 'Manage Server',
			MANAGE_ROLES: 'Manage Roles',
			MANAGE_CHANNELS: 'Manage Channels',
			KICK_MEMBERS: 'Kick Members',
			BAN_MEMBERS: 'Ban Members',
			CREATE_INSTANT_INVITE: 'Create Instant Invite',
			CHANGE_NICKNAME: 'Change Nickname',
			MANAGE_NICKNAMES: 'Manage Nicknames',
			MANAGE_EMOJIS: 'Manage Emojis',
			MANAGE_WEBHOOKS: 'Manage Webhooks',
			VIEW_CHANNEL: 'Read Text Channels and See Voice Channels',
			SEND_MESSAGES: 'Send Messages',
			SEND_TTS_MESSAGES: 'Send TTS Messages',
			MANAGE_MESSAGES: 'Manage Messages',
			EMBED_LINKS: 'Embed Links',
			ATTACH_FILES: 'Attach Files',
			READ_MESSAGE_HISTORY: 'Read Message History',
			MENTION_EVERYONE: 'Mention Everyone',
			USE_EXTERNAL_EMOJIS: 'Use External Emojis',
			ADD_REACTIONS: 'Add Reactions',
			CONNECT: 'Connect',
			SPEAK: 'Speak',
			MUTE_MEMBERS: 'Mute Members',
			DEAFEN_MEMBERS: 'Deafen Members',
			MOVE_MEMBERS: 'Move Members',
			USE_VAD: 'Use Voice Activity',
			STREAM: 'Go Live'
		};

		this.regions = {
			'eu-central': 'Central Europe',
			india: 'India',
			london: 'London',
			japan: 'Japan',
			amsterdam: 'Amsterdam',
			brazil: 'Brazil',
			'us-west': 'US West',
			hongkong: 'Hong Kong',
			southafrica: 'South Africa',
			sydney: 'Sydney',
			europe: 'Europe',
			singapore: 'Singapore',
			'us-central': 'US Central',
			'eu-west': 'Western Europe',
			dubai: 'Dubai',
			'us-south': 'US South',
			'us-east': 'US East',
			frankfurt: 'Frankfurt',
			russia: 'Russia'
		};

		this.verificationLevels = [
			'None',
			'Low',
			'Medium',
			'(╯°□°）╯︵ ┻━┻',
			'┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		];

		this.filterLevels = [
			"Don't scan any messages",
			'Scan messages from members without a role',
			'Scan messages by all members'
		];
	}

	async run(msg, [arg]) {
		if (/^\d{17,18}$/.test(arg)) arg = await this.client.users.fetch(arg);
		if (arg instanceof User) return this.userinfo(msg, arg);
		if (arg instanceof GuildMember) return this.userinfo(msg, arg.user);
		if (arg instanceof Role) return this.roleinfo(msg, arg);
		if (msg.guild && arg === 'server') return this.serverinfo(msg);
		if (msg.guild && arg === msg.guild.id) return this.serverinfo(msg);
		return this.botinfo(msg);
	}

	async userinfo(msg, user) {
		const member = msg.guild ? await msg.guild.members.fetch(user).catch(() => null) : null;
		const creator = member && (member.joinedTimestamp - msg.guild.createdTimestamp) < 3000;
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag} [${user.id}]`, user.avatarURL())
			.setThumbnail(user.avatarURL())
			.setDescription(msg.language.get('COMMAND_INFO_USER_DISCORDJOIN', this.timestamp.display(user.createdAt), Duration.toNow(user.createdAt)));
		// add guild specific info if in a guild
		if (member) {
			embed.description += msg.language.get(
				creator ? 'COMMAND_INFO_USER_GUILDRCEATE' : 'COMMAND_INFO_USER_GUILDJOIN',
				msg.guild.name,
				this.timestamp.display(member.joinedAt),
				Duration.toNow(member.joinedAt));

			const roles = member.roles.sorted((a, b) => b.position - a.position);
			const roleString = roles
				.array()
				.reduce((acc, role, idx) => acc.length + role.name.length < 1010 && role.id !== msg.guild.id
					? acc + (idx !== 0 ? ', ' : '') + role.name
					: acc,
				'');

			if (roles.size) {
				embed.addField(
					`• Role${roles.size > 2 ? `s (${roles.size - 1})` : roles.size === 2 ? '' : 's'}`,
					roleString.length ? roleString : msg.language.get('COMMAND_INFO_USER_NOROLES')
				);
			}

			const warnings = member.settings.get('warnings');
			if (warnings.length) {
				for (const { moderator } of warnings) await this.client.users.fetch(moderator);
				embed.addField(
					`• Warnings (${warnings.filter(warn => warn.active).length})`,
					warnings.map((warn, idx) => `${idx + 1}. ${!warn.active ? '~~' : ''}**${warn.reason}** | ${this.client.users.get(warn.moderator).tag}${!warn.active ? '~~' : ''}`)
				);
			}
		}
		const KSoftBan = await this.client.ksoft.bans.info(user.id);
		const DRepBan = await this.client.drep.ban(user.id);
		const DRepScore = await this.client.drep.rep(user.id).then(res => res.reputation);
		const DServicesBan = DServicesBans.get(user.id);
		const CWProfile = await this.client.chatwatch.profile(user.id);
		const rating = KSoftBan || CWProfile.blacklisted
			? 'very low'
			: DRepBan.banned || DRepScore < 0 || DServicesBans.has(user.id) || CWProfile.score > 80
				? 'low'
				: this.client.owners.has(user) || CWProfile.whitelisted
					? 'very high'
					: 'high';
		embed.addField(`• Trust (${rating})`, [
			KSoftBan
				? msg.language.get('COMMAND_INFO_USER_KSOFTBANNED', KSoftBan.reason, KSoftBan.proof)
				: msg.language.get('COMMAND_INFO_USER_KSOFTCLEAN'),
			DServicesBan
				? msg.language.get('COMMAND_INFO_USER_DSERVICESBANNED', DServicesBan.reason, DServicesBan.proof)
				: msg.language.get('COMMAND_INFO_USER_DSERVICESCLEAN'),
			CWProfile.blacklisted
				? msg.language.get('COMMAND_INFO_USER_CWBANNED', CWProfile.blacklisted_reason)
				: msg.language.get('COMMAND_INFO_USER_CWCLEAN'),
			msg.language.get('COMMAND_INFO_USER_CWSCORE', CWProfile.score),
			DRepBan.banned
				? msg.language.get('COMMAND_INFO_USER_DREPBANNED', DRepBan.reason)
				: msg.language.get('COMMAND_INFO_USER_DREPCLEAN'),
			msg.language.get('COMMAND_INFO_USER_DREPSCORE', DRepScore === 0 ? '±0' : DRepScore > 0 ? `+${DRepScore}` : DRepScore, DRepScore)
		].join('\n'));

		DRepBan.banned || KSoftBan || DServicesBans.has(user.id) || CWProfile.blacklisted || CWProfile.score > 80
			? embed.setColor(VERY_NEGATIVE)
			: embed.setColor(POSITIVE);
		return msg.sendEmbed(embed);
	}

	roleinfo(msg, role) {
		const [bots, humans] = role.members.partition(member => member.user.bot);
		const embed = new MessageEmbed()
			.setTitle(`${role.name} [${role.id}]`)
			.setColor(role.color)
			.addField('• Color', role.color ? role.hexColor : 'none', true)
			.addField('• Members', `${humans.size} human${humans.size === 1 ? '' : 's'}, ${bots.size} bot${bots.size === 1 ? '' : 's'}`, true)
			.addField('• Permissions', role.permissions.has(FLAGS.ADMINISTRATOR)
				? 'Administrator (all permissions)'
				: Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) => this.perms[perm]).join(', ') || 'none', true)
			.addField('• Created', `${this.timestamp.display(role.createdAt)} (${Duration.toNow(role.createdAt)} ago)`, true)
			.addField('• Properties', [
				role.hoist
					? `${success} displayed seperately`
					: `${error} not displayed seperately`,
				role.mentionable
					? `${success} mentionable as ${role.toString()}`
					: `${error} not mentionable`,
				!role.managed
					? `${success} configurable`
					: `${error} managed by an integration`
			].join('\n'));
		return msg.sendEmbed(embed);
	}

	async serverinfo(msg) {
		const { guild } = msg;
		const [bots, humans] = guild.members.partition(member => member.user.bot);
		const embed = new MessageEmbed()
			.setAuthor(`${guild.name} [${guild.id}]`, guild.iconURL())
			.addField('• Created', `${this.timestamp.display(guild.createdAt)} (${Duration.toNow(guild.createdAt)} ago)`)
			.addField('• Members', `${humans.size} human${humans.size === 1 ? '' : 's'}, ${bots.size} bot${bots.size === 1 ? '' : 's'}`, true)
			.addField('• Voice region', this.regions[msg.guild.region], true)
			.addField('• Owner', `${guild.owner.user.tag} ${guild.owner.toString()} [${guild.owner.id}]`)
			.addField('• Security', [
				`Verification level: ${this.verificationLevels[msg.guild.verificationLevel]}`,
				`Explicit filter: ${this.filterLevels[msg.guild.explicitContentFilter]}`
			].join('\n'));
		const icon = msg.guild.iconURL({ format: 'png' });
		if (icon) embed.setColor(await req(this.client.config.colorgenURL).path('dominant').query('image', icon).send().then(res => res.text));
		return msg.sendEmbed(embed);
	}

	botinfo(msg) {
		if (msg.guild && !msg.guild.me.permissions.has(FLAGS.EMBED_LINKS)) return msg.sendLocale('COMMAND_INFO_BOT');
		return msg.sendEmbed(new MessageEmbed()
			.setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
			.setDescription(msg.language.get('COMMAND_INFO_BOT'))
		);
	}

};
