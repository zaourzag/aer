const { host, port } = require('./mongodb');
const { prefix, devPrefix, production } = require('./aero');

const { MONGO_USER: user, MONGO_PASS: pass } = process.env;

module.exports = {
	commandEditing: true,
	commandLogging: true,
	console: { useColor: true },
	consoleEvents: {
		debug: !production,
		verbose: !production
	},
	createPiecesFolders: false,
	disabledCorePieces: ['providers'],
	owners: ['102102717165506560', '292571834770128906', '254892085000405004', '207500411907735552'],
	prefix: production ? prefix : devPrefix,
	providers: {
		default: 'mongodb',
		mongodb: {
			connectionString: `mongodb://${user}:${pass}@${host}:${port}/`,
			db: `aero${production ? '' : '-dev'}`
		}
	},
	typing: true
};
