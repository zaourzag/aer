const { Command, util } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Manage custom user prefixes.',
			subcommands: true,
			usage: '<add|remove|list:default> [prefix:str{1,20}]',
			usageDelim: ' '
		});
	}
	async add(msg, [prefix]) {
		if (!prefix) return msg.responder.error('You must provide a valid prefix to add.');
		if (msg.author.settings.prefixes.length === 20) return msg.responder.error('You can have a maximum of 20 user prefixes.');
		await msg.author.settings.sync(true);
		await msg.author.settings.update('prefixes', prefix, { action: 'add' });
		return msg.send(`Succesfully added \`${prefix}\` as a custom user prefix.`);
	}
	async remove(msg, [prefix]) {
		if (!prefix) return msg.responder.error('You must provide a valid prefix to remove.');
		await msg.author.settings.sync(true);
		await msg.author.settings.update('prefixes', prefix, { action: 'remove' });
		return msg.send(`Succesfully added \`${prefix}\` as a custom user prefix.`);
	}
	async list(msg) {
		await msg.author.settings.sync(true);
		return msg.responder.info('Your saved prefixes:', msg.author.settings.prefixes.length
			? util.codeBlock('', msg.author.settings.prefixes.join('\n'))
			: 'None saved');
	}

};
