const { Structures } = require('discord.js');

Structures.extend('GuildMember', GuildMember => {
	class AeroMember extends GuildMember {

		mute(id, reason) {
			if (!id) id = msg.guild.settings.get('mod.roles.mute');
			this.roles.add(id, reason);
		}

	}

	return AeroMember;
});
