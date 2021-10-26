import type { CommandInteraction } from 'discord.js';
import { Command, CommandOptions } from '@lib/Command';
import type { PieceContext } from '@sapphire/pieces';

export class UserCommand extends Command {
	constructor(context: PieceContext, options: CommandOptions) {
		super(context, {
			...options,
			name: 'interactionCreate',
		});
	}


	public async run(interaction: CommandInteraction) {
		return interaction.reply('Pong!');
	}
}