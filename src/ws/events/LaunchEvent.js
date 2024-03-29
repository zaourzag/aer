const Event = require('../../../lib/ws/event/Event');
const { LAUNCH_CLIENT } = require('../../../lib/ws/util/constants').types;

class LaunchEvent extends Event {

	constructor(client) {
		super(client, LAUNCH_CLIENT);
	}

	run(data) {
		this.client.launch(data);
	}

}

module.exports = LaunchEvent;
