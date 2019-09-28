const { readdirSync } = require('fs');
const { join } = require('path');

for (const file of readdirSync(join(process.cwd(), 'config'))) {
	if (!(file === 'index.js') && file.endsWith('.js')) {
		module.exports[file.split('.')[0]] = require(`./${file}`);
	}
}
