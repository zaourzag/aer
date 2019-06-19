// Copyright (c) 2019 KlasaCommunityPlugins, MIT License
// derived from https://github.com/KlasaCommunityPlugins/tags
const { Command, util } = require('klasa');
const { Util } = require('discord.js');
const { trimString } = require('../../lib/util/util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to create, remove or list tags (custom commands).',
			runIn: ['text'],
			subcommands: true,
			usage: '<add|remove|list|view> [tag:string] [content:string] [...]',
			usageDelim: ' '
		});
	}

	async add(msg, [tag, ...content]) {
		if (!tag || !content) throw 'no content ree';
		content = content.join(this.usageDelim);
		await msg.guild.settings.update('tags', [...msg.guild.settings.get('tags'), [tag.toLowerCase(), content]], { action: 'overwrite' });
		return msg.send(`Added the tag \`${tag}\` with content: \`\`\`${Util.escapeMarkdown(content)}\`\`\``);
	}

	async remove(msg, [tag]) {
		const filtered = msg.guild.settings.get('tags').filter(([name]) => name !== tag.toLowerCase());
		await msg.guild.settings.update('tags', filtered, { action: 'overwrite' });
		return msg.send(`Removed the tag \`${tag}\``);
	}

	view(msg, [tag]) {
		const emote = msg.guild.settings.get('tags').find(([name]) => name === tag.toLowerCase());
		if (!emote) throw `The tag \`${tag}\` doesn't exist.`;
		return msg.send(util.codeBlock('', emote[1]));
	}

	list(msg) {
		if (!msg.guild.settings.get('tags').length) throw 'no tags, rip';
		const { tags } = msg.guild.settings;
		const output = [`**${msg.guild.name} Tags** (Total ${tags.length})`, '```asciidoc'];
		for (const [index, [tag, value]] of tags.entries()) {
			output.push(`${index + 1}. ${tag} :: ${trimString(value, 30)}`);
		}
		output.push('```');
		return msg.send(output.join('\n'));
	}

};
