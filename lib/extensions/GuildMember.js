const { Structures } = require('discord.js');

Structures.extend('GuildMember', GuildMember => {
	class AeroMember extends GuildMember {

		mute(reason, id) {
			if (!id) id = this.guild.settings.get('mod.roles.mute');
			this.roles.add(id, reason);
		}

		unmute(reason) {
			const id = this.guild.settings.get('mod.roles.mute');
			this.roles.remove(id, reason);
		}

	}

	return AeroMember;
});
