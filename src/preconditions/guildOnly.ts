import { Precondition, PreconditionOptions } from '@lib/structures/Precondition';
import type { PieceContext } from '@sapphire/pieces';

import type { CommandInteraction } from 'discord.js';
export class interactionCreate extends Precondition {
	constructor(context: PieceContext, options: PreconditionOptions) {
		super(context, {
			...options,
			name: 'ownerOnly',
		});
	}

	public async run(interaction: CommandInteraction) {
		return interaction.guild ?
			{ pass: true } :
			{ pass: false, reason: 'This command can only be used in servers' };
	}
}