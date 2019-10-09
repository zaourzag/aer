const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(member) {
		member.guild.joinCache.add(member.id);
		setTimeout(() => { member.guild.joinCache.delete(member.id) }, 20000);
		if (member.guild.joinCache.size >= 50) this.client.emit('raid', member.guild, [...member.guild.joinCache]);
		await member.guild.log.memberJoined({ member });
		const globalBanned = await this.client.ksoft.bans.check(member.id);
		if (globalBanned) this.client.emit('globalBan', member);
		return member;
	}

};
