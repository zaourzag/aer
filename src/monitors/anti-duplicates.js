const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.duplicates') || msg.exempt) return;
		if (msg.content === msg.member.lastContent) {
			msg.delete();
			msg.member.duplicateCount++;
		} else {
			msg.member.lastContent = msg.content;
		}
	}

};
