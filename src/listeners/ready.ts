import { Listener } from '@lib/Listener';
import type { PieceContext } from '@sapphire/pieces';
import type { Client } from '@lib/Client';
import type { ListenerOptions } from '@lib/Listener';

export class readyEvent extends Listener {
	constructor(context: PieceContext, options: ListenerOptions) {
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

