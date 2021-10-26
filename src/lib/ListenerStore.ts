import { Store } from '@sapphire/pieces';
import { Event } from '@lib/Event';

export class ListenerStore extends Store<Event> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		super(Event as any, { name: 'events' });
	}
}