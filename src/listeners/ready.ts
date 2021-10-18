import { Event } from '@lib/Event';
import type { Client } from '@lib/Client';

export class readyEvent extends Event {
	constructor() {
		super();
		this.name:
	}

	public async run(client: Client) {
		console.log(`Logged in as: ${client.user?.tag}`);
	}

}

