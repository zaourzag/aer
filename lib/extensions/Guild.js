const { Structures, MessageEmbed, Permissions } = require('discord.js');
const req = require('superagent');
const { reactions, emojis: { success, error } } = require('../util/constants');
const emojis = [reactions.success, reactions.error];
const GuildLogger = require('../GuildLogger');

Structures.extend('Guild', Guild => {
	class AeroGuild extends Guild {

		constructor(...args) {
			super(...args);
			this.log = new GuildLogger(this);
			this.modCache = new Set();
			this.joinCache = new Set();
			this.raiderCache = new Set();
			this.raidConfirmation = null;
		}

		async createMuteRole(name) {
			const muterole = await this.roles.create({
				data: {
					name: name || this.language.get('COMMAND_MUTE_ROLE_DEFAULT'),
					permissions: 0,
					color: '737f8c'
				},
				reason: this.language.get('COMMAND_MUTE_ROLE_REASON')
			});

			for (const channel of this.channels.filter(chan => chan.type === 'text').values()) {
				await channel.initMute(muterole.id);
			}

			await this.settings.update('mod.roles.mute', muterole.id);

			return muterole.id;
		}

		async createRaidMessage() {
			const channel = this.channels.get(this.settings.get('raid.channel'));
			if (!channel) return this;
			const embed = await this.constructMessage();
			const message = await channel.send(this.language.get('EVENT_RAID_TITLE', success, error), { embed });
			this.raidConfirmation = message.id;
			await message.react(reactions.success);
			await message.react(reactions.error);
			const userFilter = (user) =>
				!user.bot
				&& this.members.get(user.id).hasPermission(Permissions.FLAGS.BAN_MEMBERS);
			const reactionFilter = (reaction) =>
				emojis.includes(reaction.emoji.id);
			message
				.awaitReactions((reaction, user) => userFilter(user) && reactionFilter(reaction), { max: 1 })
				.then(collected => {
					collected.first().emoji.id === reactions.success
						? this.client.emit('raidBan', message, collected.first().users.filter(userFilter))
						: this.client.emit('raidReset', message);
				});
			return this;
		}

		async updateRaidMessage() {
			const channel = this.channels.get(this.settings.get('raid.channel'));
			if (!channel) return this;
			const message = await channel.messages.fetch(this.raidConfirmation);
			if (!message) return this.createRaidMessage();
			return message.edit(this.language.get('EVENT_RAID_TITLE', success, error), await this.constructMessage());
		}

		async constructMessage() {
			const embed = new MessageEmbed().setTitle(this.language.get('EVENT_RAID_USERS_TITLE'));
			const raiders = [...this.raiderCache.values()];
			const users = this.raiderCache.size < 20
				? raiders
					.map(id => this.client.users.get(id).toString())
					.join('\n')
				: await req
					.post('https://haste.cloudy.gg')
					.send(`# Raid attempt at ${new Date()}\n${
						raiders
							.map(id => this.client.users.get(id))
							.map(user => `[${user.id}] ${user.tag}`)
					}`)
					.then(res => `https://haste.cloudy.gg/${res.body.key}.txt`);
			embed.setDescription(users);
			return embed;
		}

		raidReset() {
			this.joinCache.clear();
			this.raiderCache.clear();
			this.raidConfirmation = null;
		}

	}

	return AeroGuild;
});
