import type { CommandInteraction } from 'discord.js';
import { Command } from '@lib/Command';

export class UserCommand extends Command {
	constructor() {
		super({
			name: 'ping',
		});
	}

	public async run(interaction: CommandInteraction) {
		return interaction.reply('Pong!');
	}
}

export const crayon = 'red';