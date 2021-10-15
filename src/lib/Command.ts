import type { CommandInteraction } from 'discord.js';

export abstract class Command {
	public name: string;
	public cooldown: number;
	public description: string;
	public ownerOnly: boolean;
	public restrictions?: 'guild' | 'dms';

	constructor(options: { name: string, cooldown?: number, description?: string, ownerOnly?: boolean, restrictions?: ('guild' | 'dms') }) {
		this.name = options.name;
		this.cooldown = options.cooldown ?? 3000;
		this.description = options.description ?? 'The default command description.';
		this.ownerOnly = options.ownerOnly ?? false;
		this.restrictions = options.restrictions;
	}

	public abstract run(interaction: CommandInteraction): unknown

}