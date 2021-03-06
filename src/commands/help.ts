import type { CommandInteraction } from 'discord.js';
import { Command, CommandOptions } from '@lib/Command';
import type { PieceContext } from '@sapphire/pieces';

export class UserCommand extends Command {
	constructor(context: PieceContext, options: CommandOptions) {
		super(context, {
			...options,
			name: 'help',
			description: 'Displays information for all the commands. (The page you\'re looking at now!)',
		});
	}


	public async run(interaction: CommandInteraction) {
		const commands = this.container.stores.get('commands').map(command => `${command.name} -> ${command.description}`);
		return interaction.reply(commands.join('\n'));
	}
}