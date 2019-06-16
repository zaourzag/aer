const klasa = require('./klasa');
const discord = require('./discord');

exports.clientOptions = {
	...klasa,
	...discord
};
