import { Event } from '@lib/Event';
import type { PieceContext } from '@sapphire/pieces';
import type { Client } from '@lib/Client';
import type { EventOptions } from '@lib/Event';

export class readyEvent extends Event {
	constructor(context: PieceContext, options: EventOptions) {
		super(context, {
			...options,
			name: 'ready',
			event: 'ready',
		});
	}

	public async run(client: Client) {
		console.log(`Logged in as: ${client.user?.tag}`);
	}

}

