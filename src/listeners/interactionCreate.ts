import { Listener, ListenerOptions } from '@lib/Listener';
import type { PieceContext } from '@sapphire/pieces';

import type { CommandInteraction } from 'discord.js';
export class interactionCreate extends Listener {
	constructor(context: PieceContext, options: ListenerOptions) {
		super(context, {
			...options,
			name: 'interactionCreate',
			event: 'interactionCreate',
		});
	}

	public async run(interaction: CommandInteraction) {
		try {
			const command = this.container.stores.get('commands')?.get(interaction.commandName);
			if(!command) return;

			if(command.ownerOnly && interaction.user.id !== process.env.OWNER_ID) return;

			if(command.restrictions === 'guild' && !interaction.guild?.id) return interaction.reply({ content: 'This command can only be ran in servers!', ephemeral: true });
			if(command.restrictions === 'dms' && interaction.guild?.id) return interaction.reply({ content: 'This command can only be ran in DMs!', ephemeral: true });

			return command.run(interaction);
		} catch (e) {
			console.log(e);
			interaction.reply({ content: 'There was an error running your command! Please try again', ephemeral: true });
			// if(button collector?) send error to db???
		}

	}

}