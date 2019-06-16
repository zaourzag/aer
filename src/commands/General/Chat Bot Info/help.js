const { Command, util: { isFunction } } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { code } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['commands'],
			guarded: true,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS'],
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, msg) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, msg);
		});
	}

	async run(msg, [command]) {
		const embed = new MessageEmbed()
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.setColor(msg.member ? msg.member.displayColor : 'RANDOM');

		if (command) {
			return msg.sendEmbed(embed
				.addField(`${command.name} ${command.runIn.includes('dm') ? '' : '(Server only)'}`, [isFunction(command.description) ? command.description(msg.language) : command.description,
					isFunction(command.extendedHelp) ? command.extendedHelp(msg.language) : command.extendedHelp].join('\n'))
				.addField('• Usage', command.usage.fullUsage(msg))
				.addField('• Permission Node', code`${command.category.toLowerCase()}.${command.name}`));
		}

		const categories = this.buildHelp();
		for (const category in categories) {
			embed.addField(category, categories[category].sort().map(cmd => code`${cmd}`).join(', '));
		}
		return msg.sendEmbed(embed);
	}

	buildHelp() {
		return this.client.commands
			.filter(command => command.permissionLevel < 9)
			.reduce((categories, command) => {
				if (!(command.category in categories)) categories[command.category] = [command.name];
				else categories[command.category].push(command.name);
				return categories;
			}, {});
	}

};
