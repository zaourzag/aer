const klasa = require('./klasa');
const discord = require('./discord');

for (const file of readdirSync(join(process.cwd(), 'config'))) {
	if (!(file === 'index.js')) {
		module.exports[file.split('.')[0]] = require(`./${file}`);
	}
}
