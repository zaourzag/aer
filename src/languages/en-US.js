const { Language } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			// fun commands
			COMMAND_8BALL_DESCRPTION: 'Magic 8-Ball, does exactly what the toy does.',
			COMMAND_8BALL_PROMPT: 'What would you like to ask the magic 8ball?',
			COMMAND_8BALL_ANSWERS,
			COMMAND_8BALL_NOQUESTION: "🎱 That doesn't look like a question, try again please.",
			COMMAND_BRAIN_DESCRIPTION: 'Generates an expanding brain meme from a group of sentences. Separate the sentences using commas.',
			COMMAND_CHOICE_DESCRIPTION: 'Makes a decision for you given some choices.',
			COMMAND_CHOICE_PROMPT: 'From what would you like me to choose from? Separate choices with a comma.',
			COMMAND_CHOICE_ONEOPTION: 'You only gave me one choice, dummy.',
			COMMAND_CHOICE_REPLY: choices => `I think you should go with "${choices[Math.floor(Math.random() * choices.length)]}"`,
			COMMAND_CHUCKNORRIS_DESCRIPTION: 'Sends a random Chuck Norris joke. (Powered by https://api.chucknorris.io)',
			COMMAND_COINFLIP_DESCRIPTION: 'Flips one or more coins',
			COMMAND_COINFLIP_REPLY_MULTIPLE: (coins, heads, tails) => `You flipped ${coins} coins. ${heads} ${heads === '1' ? 'was' : 'were'} heads, and ${tails} ${tails === '1' ? 'was' : 'were'} tails.`,
			COMMAND_COINFLIP_REPLY_SINGLE: heads => `You flipped ${heads ? 'Heads' : 'Tails'}.`,
			COMMAND_COLOR_NOCOLOR: 'You need to provide a valid color to display.',
			COMMAND_COLOR_INVALIDCOLOR: 'You provided an invalid color!',
			COMMAND_COLOR_DESCRIPTION: 'Outputs the chosen color from hex.',
			COMMAND_KISS_DESCRIPTION: 'Kiss somebody you really like.',
			COMMAND_KISS_SELF: user => `${user} kissed themselves. I have no idea how and why.`,
			COMMAND_KISS_SOMEONE: (from, to) => `${from} gave ${to} a kiss. How cute. 💕`,
			COMMAND_PUN_DESCRIPTION: 'Sends a random pun. (Powered by http://icanhazdadjoke.com)',
			COMMAND_PUN_APIDOWN: 'The API appears to be down. Try again later!',
			COMMAND_PUN_REPLY: pun => `Random pun: **${pun}**`,
			COMMAND_RATE_DESCRIPTION: 'Rates the mentioned user.',
			COMMAND_RATE_REPLY: (user, percentage) => `I rate ${user} **${percentage}/100**!`,
			COMMAND_URBAN_DESCRIPTION: 'Searches the urban dictionary for the definition to a search term.',
			COMMAND_URBAN_MISSINGTERM: 'What would you like to search?',
			COMMAND_URBAN_MAX: length => `Invalid definition. Only found ${length} possible definitions.`,
			COMMAND_YOMAMMA_DESCRIPTION: 'Yo momma is so fat, yo.',

			// games
			COMMAND_GAME_CHALLENGE: user => `${user}, do you accept this challenge?`,
			COMMAND_GAME_OCCURING: 'Only one game may be occuring per channel.',
			COMMAND_GAME_NOBOTS: 'You cannot challenge bots',
			COMMAND_GAME_YOURSELF: 'You can\'t challenge yourself you loner.',
			COMMAND_GAME_DECLINED: 'Looks like they declined...',
			COMMAND_GAME_LOADING: 'Loading...',
			COMMAND_C4_DESCRIPTION: 'Play a game of connect 4.',
			COMMAND_C4_WIN: user => `🎉 The winner is <@${user}>!`,
			COMMAND_C4_MAXMOVES: 'No more possible moves. It\'s a draw!',
			COMMAND_C4_TIMEOUT: user => `Time up! <@${user}> loses.`,
			COMMAND_C4_COLLUMNFULL: user => `<@${user}>, that column is already full. Try again.`,
			COMMAND_C4_QUIT: user => `${user} has quit. They lose!`,

			// general commands
			COMMAND_TAG_DESCRIPTION: 'Allows you to create, remove or list tags (custom commands).',
			COMMAND_TAG_ADDED: (tag, content) => `Added the tag \`${tag}\` with content: \`\`\`${content}\`\`\``,
			COMMAND_TAG_REMOVED: tag => `Removed the tag \`${tag}\``,
			COMMAND_TAG_EMPTY: 'Please include what the tag is supposed to do',
			COMMAND_TAG_NOEXIST: tag => `The tag \`${tag}\` doesn't exist.`,
			COMMAND_TAG_NOTAGS: "There don't appear to be any tags configured.",

			// misc commands
			COMMAND_USERINFO_DESCRIPTION: 'Shows information about the mentioned user.',
			COMMAND_USERINFO_JOINED_DISCORD: (joinedAt, joinDuration) => `Joined Discord on ${joinedAt} (${joinDuration} ago)`,
			COMMAND_USERINFO_JOINED_GUILD: (guild, joinedAt, joinDuration) => `\nJoined ${guild} on ${joinedAt} (${joinDuration} ago)`,

			// social commands
			COMMAND_DAILY_DESCRIPTION: 'Claim your daily points! Add --reminder to be reminded in 12h.',
			COMMAND_DAILY_COOLDOWN: time => `You've already collected your daily reward. You can collect it again in ${time}`,
			COMMAND_DAILY_REMINDER: 'Collect daily reward.',
			COMMAND_DAILY_REPLY: 'You succesfully collected your daily reward!',
			COMMAND_PROFILE_DESCRIPTION: 'Shows a profile card of a user.',
			COMMAND_PROFILE_NOTMEMBER: "That user isn't in the server!",
			COMMAND_SOCIAL_DESCRIPTION: 'Configure the economy system of your server, and toggle level up messages.',
			COMMAND_SOCIAL_TOGGLE_SOCIAL: enabled => `There, **${!enabled ? 'enable' : 'disable'}d** the economy system in this server.`,
			COMMAND_SOCIAL_TOGGLE_LEVELS: enabled => `There, level up messages in this server are now **${enabled ? 'enable' : 'disable'}d**.`,
			COMMAND_SOCIAL_STATUS: enabled => `The economy system is **${enabled ? 'enable' : 'disable'}d** in this server.`,

			ERROR_GENERIC: (error) => `An error occurred: ${error}`,

			ACTIVITY_PLAYING: 'Playing',
			ACTIVITY_LISTENING: 'Listening to',
			ACTIVITY_STREAMING: 'Streaming'
		};
	}

};

const COMMAND_8BALL_ANSWERS = [
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
