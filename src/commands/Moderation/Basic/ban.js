const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['b', 'bean', '410'],
			description: '',
			usage: '<user  or  users:users> [duration:time] [reason:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [users, duration, reason]) {

		const bannable = await this.getBannable(msg.member, users);
		if (!bannable.length) return msg.responder.error(msg.language.get('COMMAND_BAN_NOPERMS', users.length > 1));


		msg.responder.error(`**WIP** debug: ${JSON.stringify({ bannable }, null, 2)}`);
	}

	async getBannable(executor, targets) {
		const ids = new Set(); // cache for filtering duplicate ids in a bulkban
		targets.forEach(async target => await executor.guild.members.fetch(target.id));
		return targets
			.map(target => executor.guild.members.get(target.id))
			.filter(target => {
				if (ids.has(target.id)) return false;
				ids.add(target.id);
				if (!target) return true;
				return executor.roles.highest.position > target.roles.highest.position;
			});
	}


};
