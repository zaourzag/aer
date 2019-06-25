require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
});
const Aero = require('./lib/Aero');

new Aero().login();
