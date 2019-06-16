const { Language } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			// fun commands
			COMMAND_8BALL_DESCRPTION: 'Magic 8-Ball, does exactly what the toy does.',
			COMMAND_8BALL_PROMPT: 'What would you like to ask the magic 8ball?',
			COMMAND_8BALL_ANSWERS: answers,
			COMMAND_8BALL_NOQUESTION: "🎱 That doesn't look like a question, try again please.",
			COMMAND_CHOICE_DESCRIPTION: 'Makes a decision for you given some choices.',
			COMMAND_CHOICE_PROMPT: 'From what would you like me to choose from? Separate choices with a comma.',
			COMMAND_CHOICE_ONEOPTION: 'You only gave me one choice, dummy.',
			COMMAND_CHOICE_REPLY: choices => `I think you should go with "${choices[Math.floor(Math.random() * choices.length)]}"`,
			COMMAND_CHUCKNORRIS_DESCRIPTION: 'Sends a random Chuck Norris joke.',
			COMMAND_CHUCKNORRIS_EXTENDEDHELP: 'Powered by https://api.chucknorris.io'
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
