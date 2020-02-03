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
			COMMAND_CHUCKNORRIS_EXTENDEDHELP: 'Powered by https://api.chucknorris.io',
            COMMAND_JOKE_DESCRIPTION: 'What do you call a cow with two legs?,Lean beef.',
			// games
			COMMAND_GAME_CHALLENGE: (user) => `${user}, do you accept this challenge?`,
			COMMAND_GAME_OCCURING: 'Only one game may be occuring per channel.',
			COMMAND_GAME_NOBOTS: 'You cannot challenge bots',
			COMMAND_GAME_YOURSELF: 'You can\'t challenge yourself you loner.',
			COMMAND_GAME_DECLINED: 'Looks like they declined...',
			COMMAND_GAME_LOADING: 'Loading...',
			COMMAND_C4_WIN: (user) => `🎉 The winner is <@${user}>!`,
			COMMAND_C4_MAXMOVES: 'No more possible moves. It\'s a draw!',
			COMMAND_C4_TIMEOUT: (user) => `Time up! <@${user}> loses.`,
			COMMAND_C4_COLLUMNFULL: (user) => `<@${user}>, that column is already full. Try again.`,
			COMMAND_C4_QUIT: (user) => `${user} has quit. They lose!`,
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
