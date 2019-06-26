const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

	async run(message, command) {
		if (message.guild && command.requireSocial && !message.guildSettings.social.enabled) {
			throw `The economy system isn't enabled in this server. Use \`${message.guildSettings.prefix}social toggle\` to enable it.`;
		}
	}

};
