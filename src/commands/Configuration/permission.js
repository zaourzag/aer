const { Permissions: { FLAGS } } = require('discord.js');
const { bold, code } = require('discord-md-tags');
const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['perms', 'permissions'],
			subcommands: true,
			usage: '[allow|deny|list|remove|nodes|clear] [target:member|target:role|everyone] [permission:string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.ADMINISTRATOR;
	}

	async run(msg) {
		return msg.send(PERMISSION_NODES_HELP);
	}

	async allow(msg, [target, permission]) {
		if (!target || !permission) throw 'Invalid usage: expecting a target and a permission.';
		await this.client.permissions.modify({
			action: 'allow',
			message: msg,
			permission,
			target
		});
		return msg.responder.success(`Added \`${permission}\` to ${target.displayName || target.username}`);
	}

	async deny(msg, [target, permission]) {
		if (!target || !permission) throw 'Invalid usage: expecting a target and a permission.';
		await this.client.permissions.modify({
			action: 'deny',
			message: msg,
			permission,
			target
		});
		return msg.responder.success(`Denied \`${permission}\` from ${target.displayName || target.username}`);
	}

	async remove(msg, [target, permission]) {
		if (!target || !permission) throw 'Invalid usage: expecting a target and a permission.';
		await this.client.permissions.modify({
			action: 'remove',
			message: msg,
			permission,
			target
		});
		return msg.responder.success(`Removed \`${permission}\` from ${target.displayName || target.username}`);
	}

};

const PERMISSION_NODES_HELP = [
	bold`Permission Nodes`,
	`Aero's permissions are ${bold`node base`} allowing complete control over what commands users and roles can use.`,
	`Permissions have 3 levels: ${bold`User, Role, Everyone`}. Nodes take priority in that order.`,
	'',
	bold`Nodes`,
	`Nodes are represented by ${code`<category.command>`}, such as ${code`general.ping`}.`,
	`You can also use wildcards such as ${code`<category>.*`} which includes all commands in the category, and ${code`*`} which includes all commands,`,
	'',
	bold`Examples`,
	`Allow Stitch to use the ping command: ${code`perms allow @Stitch general.ping`}`,
	`Disallow ravy from using all configuration commands: ${code`perms remove @ravy configuration.*`}`,
	`Allow admins to use all commands: ${code`perms allow @Admins *`}`
].join('\n');
