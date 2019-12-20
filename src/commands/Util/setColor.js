const { Command } = require('klasa');
const { FLAGS } = require('discord.js').Permissions;
const tc = require('tinycolor2');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_SETCOLOR_DESCRIPTION'),
			usage: '<role:role|rolename:rolename> <color:str>',
			aliases: ['sc'],
			usageDelim: ' ',
			quotedStringSupport: true
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [role, color]) {
		const colorData = tc(color);
		if (colorData._format === false) return msg.responder.error(msg.language.get('COMMAND_SETCOLOR_INVALIDCOLOR'));
		role.setColor(colorData.toHex());
		return msg.responder.success();
	}

};