const { Client } = require('klasa');

Client.defaultGuildSchema
	.add('tags', 'any', { array: true })
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
			.add('webhook', 'string')));

Client.defaultMemberSchema
	.add('points', 'integer', { default: 0 })
	.add('dailyTime', 'integer', { default: 0 })
	.add('level', 'integer', { default: 1 });
