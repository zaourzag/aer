/* eslint-disable complexity */
const { GuildMember, Role, Permissions: { FLAGS } } = require('discord.js');
const { util } = require('klasa');

class Permissions {

	constructor(client) {
		this.client = client;
		this.client.on('klasaReady', this.init.bind(this));
	}

	// modify edits permissions for the target. action can be "allow", "deny", "remove" or "clear"
	async modify({ action, target, message, permission }) {
		if (!Permissions.canModify(message.member, target)) throw "You can't modify permissions for that target.";
		permission = this.validate(permission);
		let nodes = await this.provider.get('permNodes', message.guild.id);
		if (!nodes) {
			// do not unnecessarily create the nodes
			if (['clear', 'remove'].includes(action)) throw 'There are no permission nodes configured in this server.';

			// create the nodes so we can add to them
			await this.provider.create('permNodes', message.guild.id, Permissions.schema);
			nodes = { ...Permissions.schema };
		}
		const treeName = Permissions.getTree(target);

		switch (action) {
			case 'remove':
			case 'allow':
			case 'deny': {
				const { category, command } = permission;

				// for remove, set the node to null so its removed while copying the object
				const value = action === 'remove' ? undefined : action === 'allow';
				if (treeName === 'everyone') {
					if (!command) nodes.everyone[category] = value;
					else util.makeObject(`everyone.${category}.${command}`, value, nodes);
				} else {
				/* eslint-disable no-lonely-if */
					if (!command) util.makeObject(`${treeName}.${target.id}.${category}`, value, nodes);
					else util.makeObject(`${treeName}.${target.id}.${category}.${command}`, value, nodes);
				/* eslint-enable no-lonely-if */
				}

				// removes fields set to undefined. there's probably a more performant way of doing this.
				if (action === 'remove') nodes = Object.assign(JSON.parse(JSON.stringify(nodes)), { _id: nodes._id });
				break;
			}

		// no default
		}
		await this.provider.replace('permNodes', message.guild.id, nodes);
	}

	/*
	 * canUse returns whether the invoker can use the supplied command. it checks permission nodes
	 * with the heirarchy order: users, roles, everyone. if permission nodes are not configured, it
	 * defaults to the default permissions of the command
	 */
	async canUse(msg, command) {
		// owners bypass permission nodes
		if (msg.author.id === msg.guild.ownerID) return true;
		const permNodes = await this.provider.get('permNodes', msg.guild.id);

		// default to the required permissions of the command if nodes are not configured
		if (!permNodes) {
			return command.defaultPermissions
				? msg.member.permissions.has(command.defaultPermissions)
				: true;
		}
		const trees = [
			permNodes.users[msg.author.id] || {},
			permNodes.roles[msg.member.roles.highest.id] || {},
			permNodes.everyone
		];
		for (const tree of trees) {
			const result = this.checkTree(command, tree);
			if (result !== 'none') return result;
		}
		return command.defaultPermissions ? msg.member.permissions.has(command.defaultPermissions) : true;
	}

	/*
	 * checkTree checks for permission nodes in the tree. it checks <category>.<command>,
	 * <category>.* and *, in that order. checkTree returns true, false and "none" to distinguish
	 * unconfigured nodes and nodes set to false.
	 */
	checkTree(command, tree) {
		const category = command.category.toLowerCase();

		// category nodes take priority over *
		if (category in tree) {
			const categoryNode = tree[category];
			console.log(categoryNode);
			// category.command takes precedence over category.*
			if (command.name in categoryNode) return categoryNode[command.name];
			else if ('*' in categoryNode) return categoryNode['*'];
		} else if ('*' in tree) {
			return tree['*'];
		}
		return 'none';
	}

	// canModify returns whether a member can modify permission nodes for the target.
	static canModify(member, target) {
		// owners can modify permission nodes for everyone
		if (member.id === member.guild.ownerID) return true;

		// members can modify permission nodes of members with lower roles than them
		if (target instanceof GuildMember) {
			// members cannot modify permission nodes of the owner
			if (target.id === member.guild.ownerID) return false;
			return member.roles.highest.position > target.roles.highest.position;
		} else if (target instanceof Role) {
			// members can modify permission nodes of roles lower than them
			return member.roles.highest.position > target.position;
		} else if (target === 'everyone') {
			// only administrators can modify permissions for everyone
			return member.permissions.has(FLAGS.ADMINISTRATOR);
		}
		return false;
	}

	// getTree returns the name of the tree
	static getTree(target) {
		if (target instanceof GuildMember) return 'users';
		else if (target instanceof Role) return 'roles';
		return 'everyone';
	}

	// validate parses a raw permission into { category, command }
	validate(permission) {
		if (permission === '*') return { category: '*', command: null };
		const [category, command] = permission.split('.');
		if (!command) throw 'Invalid usage: a command or wildcard has to be specified.';
		if (!this.categories.has(category)) throw 'Invalid usage: choose a valid command category.';
		if (command !== '*' && !this.client.commands.has(command)) throw 'Invalid usage: choose a valid command or use the * wildcard.';
		return { category, command: this.client.commands.get(command) || command };
	}

	get provider() {
		return this.client.providers.default;
	}

	init() {
		this.categories = new Set(this.client.commands.map(command => command.category.toLowerCase()));
	}

}

Permissions.schema = {
	users: {},
	roles: {},
	everyone: {}
};

module.exports = Permissions;
