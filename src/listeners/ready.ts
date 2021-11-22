import { Listener, ListenerOptions } from '@lib/Listener';
import type { PieceContext } from '@sapphire/pieces';
import type { Client } from '@lib/Client';

export class readyEvent extends Listener {
	constructor(context: PieceContext, options: ListenerOptions) {
		super(context, {
			...options,
			name: 'ready',
			event: 'ready',
		});
	}

	public async run(client: Client) {
		client.loadCommands();
		console.log(`Logged in as: ${client.user?.tag}`);
	}
}

