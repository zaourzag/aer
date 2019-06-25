const { Client } = require('klasa');

Client.defaultGuildSchema
	.add('tags', 'any', { array: true });
