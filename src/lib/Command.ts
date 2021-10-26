import type { CommandInteraction } from 'discord.js';
import { Piece, PieceContext } from '@sapphire/pieces';

export type Awaitable<T> = PromiseLike<T> | T;

export abstract class Command extends Piece {
	public readonly name: string;
	public readonly cooldown: number;
	public readonly description: string;
	public readonly ownerOnly: boolean;
	public readonly restrictions?: 'guild' | 'dms';

	constructor(context: PieceContext, options: CommandOptions) {
		super(context, options);
		this.name = options.name;
		this.cooldown = options.cooldown ?? 3000;
		this.description = options.description ?? 'The default command description.';
		this.ownerOnly = options.ownerOnly ?? false;
		this.restrictions = options.restrictions;
	}

	public abstract run(interaction: CommandInteraction): Awaitable<unknown>;

}

export interface CommandOptions {
	name: string,
	cooldown?: number,
	description?: string,
	ownerOnly?: boolean,
	restrictions?: ('guild' | 'dms'),
}