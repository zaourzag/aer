module.exports = {
	BRAIN_MEME_ID: 93895088,
	emojis: {
		error: '<:mCross:589499156637417483>',
		success: '<:mCheck:589498583364009995>'
	},
	color: {
		VERY_NEGATIVE: 'CC4625',
		NEGATIVE: 'E69539',
		SLIGHTLY_NEGATIVE: 'E6C72E',
		POSITIVE: '13CC6A',
		INFORMATION: '3D90E6'
	},
	log: {
		// mod actions
		ban: {
			type: 'moderation',
			icon: 'https://cdn.discordapp.com/emojis/492978447170404353.png'
		},
		unban: {
			type: 'moderation',
			icon: ''
		},
		tempban: {
			type: 'moderation',
			icon: ''
		},
		tempbanEnd: {
			type: 'moderation',
			icon: ''
		},
		softban: {
			type: 'moderation',
			icon: ''
		},
		globalBan: {
			type: 'moderation',
			icon: ''
		},
		globalUnban: {
			type: 'moderation',
			icon: ''
		},
		bulkBan: {
			type: 'moderation',
			icon: ''
		},
		kick: {
			type: 'moderation',
			icon: ''
		},
		mute: {
			type: 'moderation',
			icon: ''
		},
		unmute: {
			type: 'moderation',
			icon: ''
		},
		tempmute: {
			type: 'moderation',
			icon: ''
		},
		tempmuteEnd: {
			type: 'moderation',
			icon: ''
		},
		warn: {
			type: 'moderation',
			icon: ''
		},

		// message logging
		messageEdited: {
			type: 'messages',
			icon: ''
		},
		messageDeleted: {
			type: 'messages',
			icon: ''
		},

		// member logging
		memberJoined: {
			type: 'members',
			icon: ''
		},
		memberLeft: {
			type: 'members',
			icon: ''
		}
	}
};

module.exports.noop = () => { }; /* eslint-disable-line no-empty-function */
