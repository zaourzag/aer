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
			.add('mute', 'role')
			.add('auto', 'role', { array: true })
			.add('bots', 'role'))
		.add('anti', subfolder => subfolder
			.add('duplicates', 'boolean')
			.add('invites', 'boolean')
			.add('copypastas', 'boolean')
			.add('hoisting', 'boolean')
			.add('unmentionable', 'boolean')
			.add('spam', 'boolean'))
		.add('ignored', subfolder => subfolder
			.add('users', 'user', { array: true })
			.add('roles', 'role', { array: true })
			.add('channels', 'channel', { array: true })))
	.add('raid', folder => folder
		.add('channel', 'channel'))
	.add('stats', folder => folder
		.add('messages', 'integer', { default: 0 })
		.add('toxicity', 'float', { default: 0 })
	);

Client.defaultMemberSchema
	.add('points', 'integer', { default: 0 })
	.add('lastDailyTimestamp', 'integer', { default: 0 })
	.add('level', 'integer', { default: 1 })
	.add('warnings', 'any', { array: true, default: [] })
	.add('persistRoles', 'string', { array: true, default: [] })
	.add('persistNick', 'string')
	.add('stats', folder => folder
		.add('messages', 'integer', { default: 0 })
		.add('toxicity', 'float', { default: 0 })
	);

Client.defaultUserSchema
	.add('stats', folder => folder
		.add('messages', 'integer', { default: 0 })
		.add('toxicity', 'float', { default: 0 })
		.add('reputation', subfolder => subfolder
			.add('total', 'integer', { default: 0 })
			.add('individual', 'user', { array: true, default: [] })
		)
	)
	.add('lastReputationTimestamp', 'integer', { default: 0 });
