import { Store } from '@sapphire/pieces';
import { Listener } from '@lib/Listener';

export class ListenerStore extends Store<Listener> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		super(Listener as any, { name: 'events' });
	}
}