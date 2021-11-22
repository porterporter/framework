import { Precondition, PreconditionOptions } from '@lib/Precondition';
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
		return process.env.OWNER === interaction.user.id ?
			{ pass: true } :
			{ pass: false, reason: 'This command is for owners only!' };
	}
}