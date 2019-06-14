const Aero = require('./lib/Aero');
const config = require('../config');

new Aero().login(config.token);
