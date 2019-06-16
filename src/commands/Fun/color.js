const { Command } = require('klasa');
const superagent = require('superagent');
const color = require('tinycolor2');

const toTitleCase = str => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: 'Outputs the chosen color from hex.',

			usage: '[random|display] [color:str] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [action, ...hexCode]) {
		if (!action) {
			if (!hexCode) action = 'random';
			else action = 'display';
		}
		return this[action](msg, hexCode.join(' '));
	}

	async display(msg, hexCode) {
		if (!hexCode) return msg.responder.error('You need to provide a valid color to display.');
		const colorData = color(hexCode);
		if (colorData._format === false) return msg.responder.error('You provided an invalid color!');
		const img = await this.draw(colorData.toHex());
		return msg.channel.sendFile(img, 'color.png', `**${colorData.toName() ? toTitleCase(colorData.toName()) : 'Unnamed'}**
Hex: ${colorData.toHexString()}
RGB: ${colorData.toRgbString()}
HSV: ${colorData.toHsvString()}`);
	}

	random(msg) {
		const random = color.random();
		return this.display(msg, random.toHex());
	}

	async draw(hex) {
		const { body } = await superagent.get('http://localhost:3002/color')
			.query({ color: encodeURIComponent(hex) });
		return body;
	}

};
