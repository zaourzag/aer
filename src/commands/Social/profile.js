const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const { readFile } = require('fs-nextra');
const superagent = require('superagent');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PROFILE_DESCRIPTION'),
			usage: '[user:username]'
		});

		this.requireSocial = true;
	}

	async run(msg, [user = msg.author]) {
		const member = await msg.guild.members.fetch(user.id);
		await member.settings.sync(true);

		const { db } = this.client.providers.default;
		if (!member) return msg.responder.error(msg.language.get('COMMAND_PROFILE_NOTMEMBER'));
		const { points, level } = member.settings;
		const nextLevel = Math.floor(((level + 1) / 0.2) ** 2);
		const currLevel = Math.floor((level / 0.2) ** 2);
		const { body } = await superagent.get(user.displayAvatarURL({ format: 'png' }));
		const progBar = ((points - currLevel) / nextLevel) * 300;
		const canvas = new Canvas(500, 200);
		const bg = await readFile(`${process.cwd()}/assets/backgrounds/default.jpg`);

		const list = await db.collection('members').find({ id: { $regex: `^${msg.guild.id}` } }).toArray();
		const rank = list.indexOf(list.find(l => l.id === `${msg.guild.id}.${msg.author.id}`));

		canvas.addImage(bg, 0, 0, 500, 200)
			.save()
			.beginPath()
			.moveTo(0, 0)
			.lineTo(0, 200)
			.lineTo(300, 200)
			.lineTo(150, 0)
			.closePath()
			.clip()
			.setColor('#2C2F33')
			.fill()
			.restore()
			.addCircle(100, 125, 60)
			.addCircularImage(body, 100, 125, 60, true)
			.addBeveledRect(180, 120, 300, 20, 10)
			.setColor('#2C2F33')
			.addBeveledRect(180, 120, 300, 20, 10)
			.restore()
			.setColor('#B24619')
			.addBeveledRect(180, 120, progBar, 20, 10)
			.restore()
			.setTextAlign('center')
			.setTextFont(`${this.getTextLength(user.username)}pt Roboto`)
			.setColor('#FFFFFF')
			.addText(user.username, 95, 50)
			.restore()
			.setTextFont('20pt Roboto')
			.setTextAlign('left')
			.addText(`${points} / ${nextLevel}`, 180, 110)
			.setTextFont('12pt Roboto')
			.setTextAlign('center')
			.addText(`Level ${level} (#${rank + 1})`, 230, 158);
		return msg.channel.sendFile(canvas.toBuffer(), 'profile.png');
	}

	getTextLength(username) {
		if (username.length < 10) return 24;
		else if (username.length < 15) return 18;
		else if (username.length < 20) return 14;
		else if (username.length < 25) return 10;
		else return 6;
	}

};
