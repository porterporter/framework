import type { CommandInteraction, ApplicationCommandOption } from 'discord.js';
import { Piece, PieceContext } from '@sapphire/pieces';

export type Awaitable<T> = PromiseLike<T> | T;

export abstract class Command extends Piece {
	public readonly name: string;
	public readonly cooldown: number;
	public readonly description: string;
	public readonly ownerOnly: boolean;
	public readonly restrictions?: 'guild' | 'dms';
	public readonly discordOptions: DiscordOptions;


	constructor(context: PieceContext, options: CommandOptions) {
		super(context, options);
		this.name = options.name;
		this.cooldown = options.cooldown ?? 3000;
		this.description = options.description ?? 'The default command description.';
		this.ownerOnly = options.ownerOnly ?? false;
		this.restrictions = options.restrictions;
		this.discordOptions = {
			options: options.discordOptions?.options ?? [],
			defaultPermission: options.discordOptions?.defaultPermission ?? true,
		};

	}

	public abstract run(interaction: CommandInteraction): Awaitable<unknown>;

}

export interface CommandOptions {
	name: string;
	cooldown?: number;
	description?: string;
	ownerOnly?: boolean;
	restrictions?: ('guild' | 'dms');
	discordOptions?: DiscordOptions;
}


export interface DiscordOptions {
	options: ApplicationCommandOption[];
	defaultPermission: boolean;
}

export interface simpleCommand {
	name: string;
	description: string;
	options: ApplicationCommandOption[],
	defaultPermission: boolean;
}