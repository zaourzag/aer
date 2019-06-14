const { Language } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			// fun commands
			COMMAND_8BALL_DESCRPTION: 'Magic 8-Ball, does exactly what the toy does.',
			COMMAND_8BALL_PROMPT: 'What would you like to ask the magic 8ball?',
			COMMAND_8BALL_ANSWERS: answers,
			COMMAND_8BALL_NOQUESTION: "🎱 That doesn't look like a question, try again please."
		};
	}

};

const answers = [
	'Maybe.',
	'Certainly not.',
	'I hope so.',
	'Not in your wildest dreams.',
	'There is a good chance.',
	'Quite likely.',
	'I think so.',
	'I hope not.',
	'I hope so.',
	'Never!',
	'Fuhgeddaboudit.',
	'Ahaha! Really?!?',
	'Pfft.',
	'Sorry, bucko.',
	'Hell, yes.',
	'Hell to the no.',
	'The future is bleak.',
	'The future is uncertain.',
	'I would rather not say.',
	'Who cares?',
	'Possibly.',
	'Never, ever, ever.',
	'There is a small chance.',
	'Yes!'
];
