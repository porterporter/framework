import { Event } from '@lib/Event';
import type { Client } from '@lib/Client';

export class interactionCreate extends Event {
	constructor() {
		super({
			name: 'ready',
			event: 'ready',
		});
	}

	public async run(client: Client) {
		console.log(`Logged in as: ${client.user?.tag}`);
	}

}

