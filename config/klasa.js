const { host, port } = require('./mongodb');
const { prefix, stage, owners } = require('./aero');
const db = {
	production: 'aero',
	staging: 'aero-staging',
	development: 'aero-dev'
}[stage];

const { MONGO_USER: user, MONGO_PASS: pass } = process.env;

module.exports = {
	commandEditing: true,
	commandLogging: true,
	console: { useColor: true },
	consoleEvents: {
		debug: stage === 'development',
		verbose: stage === 'development'
	},
	createPiecesFolders: false,
	disabledCorePieces: ['providers', 'languages', 'commands'],
	owners,
	prefix,
	providers: {
		default: 'mongodb',
		mongodb: {
			connectionString: `mongodb://${user}:${pass}@${host}:${port}/`,
			db
		}
	},
	typing: false,
	readyMessage: 'Connected to Discord.'
};
