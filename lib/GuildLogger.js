const { log, noop } = require('./util/constants');
const { Duration } = require('klasa');
const reflectors = [
	'toString', 'valueOf', 'inspect', 'constructor',
	Symbol.toPrimitive, Symbol.for('util.inspect.custom')
];

class GuildLogger {

	constructor(guild) {
		this.guild = guild;
		this.webhooks = {
			moderation: null,
			messages: null,
			members: null
		};

		const handler = {
			get: (obj, prop) => {
				if (reflectors.includes(prop)) return { webhooks: this.webhooks, guild: this.guild }[prop];
				if (!log[prop]) return noop;
				return (arg) => {
					obj.send({ type: log[prop].type, action: prop, ...arg });
				};
			}
		};

		return new Proxy(this, handler);
	}

	async send({ type, action, user, users, member, moderator, reason, duration }) {
		if (!this.webhooks[type]) {
			const succeeded = await this.updateHook(type);
			if (!succeeded) return;
		}

		if (user && typeof user === 'string') user = await this.guild.client.users.fetch(user);
		if (moderator && typeof moderator === 'string') moderator = await this.guild.client.users.fetch(moderator);
		if (duration && duration instanceof Date) duration = Duration.toNow(duration);

		this.webhooks[type].send([
			user
				? this.guild.language.get('LOG_ARGS_USER', user.tag, user.toString(), user.id)
				: null,
			users
				? this.guild.language.get('LOG_ARGS_USERS', users.map(u => typeof u === 'string' ? u : u.id).join(', '))
				: null,
			member
				? this.guild.language.get('LOG_ARGS_MEMBER', member.displayName !== member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag, member.user.toString(), member.id)
				: null,
			moderator
				? this.guild.language.get('LOG_ARGS_MODERATOR', moderator.tag || moderator.user.tag, moderator.toString(), moderator.id)
				: null,
			reason
				? this.guild.language.get('LOG_ARGS_REASON', reason)
				: null,
			duration
				? this.guild.language.get('LOG_ARGS_DURATION', duration)
				: null
		].filter(item => item).join('\n'), {
			username: this.guild.language.get(`LOG_ACTION_${action.toUpperCase()}`),
			avatarURL: log[action].icon
		});
	}

	async updateHook(types = ['moderation', 'messages', 'members']) {
		if (!Array.isArray(types)) types = [types];
		let succeeded = 0;
		for (const type of types) {
			const { channel, webhook } = this.guild.settings.get(`logs.${type}`);
			if (channel && webhook) {
				const hook = await this.guild.channels.get(channel)
					.fetchWebhooks()
					.then(hooks => hooks.get(webhook));
				if (hook) this.webhooks[type] = hook;
				succeeded++;
			}
		}
		return succeeded === types.length;
	}

}

module.exports = GuildLogger;
