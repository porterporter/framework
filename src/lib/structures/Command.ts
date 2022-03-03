import type { CommandInteraction, PermissionResolvable } from 'discord.js';
import type { SlashCommandBuilder, ToAPIApplicationCommandOptions } from '@discordjs/builders';
import { Piece, PieceContext } from '@sapphire/pieces';
import { RateLimitManager } from '@sapphire/ratelimits';
export type Awaitable<T> = PromiseLike<T> | T;

export abstract class Command extends Piece {
	public readonly name: string;
	public readonly cooldown: RateLimitManager;
	public readonly description: string;
	public readonly preconditions: string[];
	public readonly clientPermissions?: PermissionResolvable;
	public readonly userPermissions?: PermissionResolvable;
	public readonly data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
	public readonly permissionLevel?: number


	constructor(context: PieceContext, options: CommandOptions) {
		super(context);
		this.name = options.data.name;
		this.cooldown = new RateLimitManager(options.cooldown ?? 3000);
		this.description = options.data.description ?? 'The default command description.';

		this.preconditions = options.preconditions ?? [];

		this.clientPermissions = options.clientPermissions;
		this.userPermissions = options.userPermissions;

		this.permissionLevel = options.permissionLevel ?? 0;

		this.data = options.data;
	}
	public abstract run(interaction: CommandInteraction): Awaitable<unknown>;

}

export interface CommandOptions {
	data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
	cooldown?: number;
	preconditions?: string[],
	clientPermissions?: PermissionResolvable,
	userPermissions?: PermissionResolvable,
	options: ToAPIApplicationCommandOptions[];
	permissionLevel?: number;
}
