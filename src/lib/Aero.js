const { Client } = require('klasa');
const config = require('../../config');

const production = process.env.NODE_ENV === 'production';

module.exports = class Aero extends Client {

	constructor() {
		super({
			// klasa options
			commandEditing: true,
			commandLogging: true,
			console: { useColor: true },
			consoleEvents: {
				debug: !production,
				verbose: !production
			},
			createPiecesFolders: false,
			prefix: process.env.NODE_ENV === 'production' ? 'a!' : 'ad!',
			providers: {
				default: 'mongodb',
				mongodb: {
					db: 'aero',
					connectionString: config.mongoURL
				}
			},
			typing: true,

			// discord.js options
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			fetchAllMembers: false
		});
	}

};
