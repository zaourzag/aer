require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env'
});

const Manager = require('../lib/Manager');

new Manager().init();
