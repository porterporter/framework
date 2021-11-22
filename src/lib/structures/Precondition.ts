import type { CommandInteraction } from 'discord.js';
import { Piece, PieceContext } from '@sapphire/pieces';

export type Awaitable<T> = PromiseLike<T> | T;

export abstract class Precondition extends Piece {
	public readonly name: string;

	constructor(context: PieceContext, options: PreconditionOptions) {
		super(context, options);
		this.name = options.name;
	}

	public abstract run(interaction: CommandInteraction): Awaitable<PreconditionData>;

}

export interface PreconditionOptions {
	name: string;
}

export interface PreconditionData {
	pass: boolean
	reason?: string;
}