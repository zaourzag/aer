const { Client } = require('klasa');

const config = require('../../config');
const Permissions = require('./Permissions');
require('./extensions/Message');

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
			disabledCorePieces: ['providers'],
			owners: config.owners,
			prefix: production ? 'a!' : 'ad!',
			providers: {
				default: 'mongodb',
				mongodb: {
					connectionString: config.mongoURL,
					db: 'aero'
				}
			},
			typing: true,

			// discord.js options
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			fetchAllMembers: false
		});

		this.permissions = new Permissions(this);
	}

};
