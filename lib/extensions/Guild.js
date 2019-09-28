const { Structures } = require('discord.js');
const GuildLogger = require('../GuildLogger');

Structures.extend('Guild', Guild => {
	class AeroGuild extends Guild {

		constructor(...args) {
			super(...args);
			this.log = new GuildLogger(this);
			this.modCache = new Set();
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


	}

	return AeroGuild;
});
