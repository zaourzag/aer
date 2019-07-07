const types = {

	IDENTIFY_CLIENT: 0,
	LAUNCH_CLIENT: 1,
	READY_CLIENT: 2,
	RECONNECT_CLIENT: 3

};

const states = {

	CONNECTING: 0,
	CONNECTED: 1,
	CLOSING: 2,
	CLOSED: 3,
	RECONNECTING: 4,
	IDLE: 5

};

module.exports = { types, states };
