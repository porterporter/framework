import { Store } from '@sapphire/pieces';
import { Command } from '@lib/structures/Command';

export class CommandStore extends Store<Command> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		super(Command as any, { name: 'commands' });
	}
}