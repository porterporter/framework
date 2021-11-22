import { Piece, PieceContext } from '@sapphire/pieces';

export abstract class Listener extends Piece {
	public readonly name: string;
	public readonly event: string;
	public readonly once: boolean;

	constructor(context: PieceContext, options: ListenerOptions) {
		super(context, options);
		this.name = options.name;
		this.event = options.event;
		this.once = options.once ?? false;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public abstract run(...args: any[]): any;

}

export interface ListenerOptions {
	name: string,
	event: string,
	once?: boolean
}