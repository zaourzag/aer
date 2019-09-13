const { Monitor } = require('klasa');
const util = require('../../lib/util/util');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('social.enabled') || !msg.guild.me.permissions.has(['SEND_MESSAGES'])) return;
		const key = `${msg.guild.id}.${msg.author.id}`;
		if (this.cache.has(key)) return;
		const incremented = util.random(5, 10);
		await msg.member.settings.sync(true);
		const currLevel = msg.member.settings.level;
		const newXp = msg.member.settings.points + incremented;
		const newLevel = Math.floor(0.2 * Math.sqrt(newXp));

		await msg.member.settings.update([['points', newXp], ['level', newLevel]]);

		this.cache.add(key);
		setTimeout(() => this.cache.delete(key), 45 * 1000);
		if (newLevel !== currLevel && newLevel !== 0) {
			if (msg.guild.settings.social.levelupMessages) {
				await msg.channel.send(util.randomArray(LEVEL_MESSAGES)
					.replace(/{level}/g, newLevel).replace(/{user}/g, msg.author.username));
			}
		}
	}

	async init() {
		this.cache = new Set();
	}

};

const LEVEL_MESSAGES = [
	"Hey, you levelled up! You're now level {level}!",
	"You've been doing excellent, so here's a level up! You're now level {level}!",
	"Oh, come on, you're not hacking, are you? You're level {level} already!",
	"Oh, how time flies. You're already level {level}!",
	"It's a bird! No, it's a plane! No, it's a level up! You're now level {level}!"
];
