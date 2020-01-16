// Author: William Johnstone <william@endevrr.com>
const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false,
			emitter: 'ws'
		});
	}

	async run(data) {
		const guild = this.client.guilds.get(data.guild_id)

		const reactionRoles = guild.settings.get('mod.roles.reactionRoles')

		reactionRoles.find(reactionRole => {
			if (reactionRole.messageid === data.message_id && reactionRole.emoteid === data.emoji.id) {
				const member = guild.members.get(data.user_id)
				const role = guild.roles.get(reactionRole.roleid)
				member.roles.remove(role, guild.language.get('COMMAND_REACTIONROLE_ROLEUPDATE_REASON'))
				return true
			}
		});
	}

};
