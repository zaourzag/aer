const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(member) {
		await member.settings.sync();
		await member.roles.add(member.settings.get('persistRoles'), member.guild.language.get('EVENT_JOIN_PERSISTREASON'));
		if (member.settings.get('persistNick')) await member.setNickname(member.settings.get('persistNick'));
		member.guild.joinCache.add(member.id);
		setTimeout(() => { member.guild.joinCache.delete(member.id); }, 20000);
		if (member.guild.joinCache.size >= 50) this.client.emit('raid', member.guild, [...member.guild.joinCache]);
		member.guild.modCache.add(member.id);
		await this.dehoist(member);
		await this.cleanName(member);
		member.guild.modCache.delete(member.id);
		await member.guild.log.memberJoined({ member });
		const globalBanned = await this.client.ksoft.bans.check(member.id);
		if (globalBanned) this.client.emit('globalBan', member);
		return member;
	}

	dehoist(member) {
		if (!member.guild.settings.get('mod.anti.hoisting')) return member;
		if (member.displayName[0] < '0') member.dehoist();
		return member;
	}

	cleanName(member) {
		if (!member.guild.settings.get('mod.anti.unmentionable')) return member;
		member.cleanName();
		return member;
	}

};
