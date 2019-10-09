const { Structures } = require('discord.js');

Structures.extend('GuildMember', GuildMember => {
	class AeroMember extends GuildMember {

		constructor(...args) {
			super(...args);
			this.lastContent = null;
			this.duplicateCount = 0;
		}

		mute(reason, id) {
			if (!id) id = this.guild.settings.get('mod.roles.mute');
			if (!id) return;
			this.roles.add(id, reason);
		}

		unmute(reason) {
			const id = this.guild.settings.get('mod.roles.mute');
			if (!id) return;
			this.roles.remove(id, reason);
		}

	}

	return AeroMember;
});
