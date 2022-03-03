import { Store } from '@sapphire/pieces';
import { Precondition } from '@structures/Precondition';

export class PreconditionStore extends Store<Precondition> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		super(Precondition as any, { name: 'preconditions' });
	}
}