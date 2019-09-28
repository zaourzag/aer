const { Client } = require('klasa');

Client.defaultGuildSchema
	.add('tags', 'any', { array: true, configurable: false })
	.add('social', folder => folder
		.add('enabled', 'boolean', { default: false })
		.add('levelupMessages', 'boolean', { default: true }))
	.add('logs', folder => folder
		.add('moderation', subfolder => subfolder
			.add('channel', 'channel')
			.add('webhook', 'string'))
		.add('messages', subfolder => subfolder
			.add('channel', 'channel')
			.add('webhook', 'string'))
		.add('members', subfolder => subfolder
			.add('channel', 'channel')
			.add('webhook', 'string')))
	.add('mod', folder => folder
		.add('roles', subfolder => subfolder
			.add('mute', 'role')));

Client.defaultMemberSchema
	.add('points', 'integer', { default: 0 })
	.add('dailyTime', 'integer', { default: 0 })
	.add('level', 'integer', { default: 1 });
