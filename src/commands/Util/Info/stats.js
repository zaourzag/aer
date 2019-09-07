const { Command, version: klasaVersion, Duration } = require('klasa');
const { version: discordVersion } = require('discord.js');
const { hostname, totalmem, cpus, loadavg } = require('os');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(message) {
		return message.sendCode('asciidoc', message.language.get('COMMAND_STATS',
			(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
			(totalmem() / 1024 / 1024 / 1024).toFixed(0) * 1024,
			(loadavg()[0] * 100).toFixed(1),
			cpus().length,
			(cpus()[0].speed / 1000).toFixed(1),
			Duration.toNow(Date.now() - (process.uptime() * 1000)),
			klasaVersion, discordVersion, process.version, hostname(), message
		));
	}

};
