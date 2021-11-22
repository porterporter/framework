import type { CommandInteraction, PermissionResolvable, ApplicationCommandPermissionData } from 'discord.js';
import type { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import { Piece, PieceContext } from '@sapphire/pieces';
export type Awaitable<T> = PromiseLike<T> | T;

export abstract class Command extends Piece {
	public readonly name: string;
	public readonly cooldown: number;
	public readonly description: string;
	public readonly defaultPermission: boolean;
	public readonly preconditions: string[];
	public readonly clientPermissions?: PermissionResolvable;
	public readonly userPermissions?: PermissionResolvable;
	public readonly _options?: ToAPIApplicationCommandOptions[];
	public readonly permissions?: ApplicationCommandPermissionData[];


	constructor(context: PieceContext, options: CommandOptions) {
		super(context, options);
		this.name = options.name;
		this.cooldown = options.cooldown ?? 3000;
		this.description = options.description ?? 'The default command description.';
		this.defaultPermission = options.defaultPermission ?? true;
		this.preconditions = options.preconditions ?? [];
		this.clientPermissions = options.clientPermissions;
		this.userPermissions = options.userPermissions;
		this.permissions = options.permissions ?? [];
		this._options = options.options;
	}
	public abstract run(interaction: CommandInteraction): Awaitable<unknown>;

}

export interface CommandOptions {
	name: string;
	cooldown?: number;
	description?: string;
	defaultPermission?: boolean;
	preconditions?: string[],
	clientPermissions?: PermissionResolvable,
	userPermissions?: PermissionResolvable,
	options?: ToAPIApplicationCommandOptions[]
	permissions?: ApplicationCommandPermissionData[]
}
