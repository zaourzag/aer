class Event {

	constructor(client, name) {
		this.client = client;
		this.name = name;
		console.log('ev.constructor')
	}

	run() {
		throw new SyntaxError('This should be overwritten in the actual event!');
	}

}

module.exports = Event;
