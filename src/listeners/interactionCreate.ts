import { Event } from '@lib/Event';
import type { PieceContext } from '@sapphire/pieces';
import type { EventOptions } from '@lib/Event';


import type { CommandInteraction } from 'discord.js';
export class interactionCreate extends Event {
	constructor(context: PieceContext, options: EventOptions) {
		super(context, {
			...options,
			name: 'interactionCreate',
			event: 'interactionCreate',
		});
	}

	public async run(interaction: CommandInteraction) {
		try {
			const command = this.container.data.commands.get(interaction.commandName);
			if(!command) return;

			if(command.ownerOnly && interaction.user.id !== process.env.OWNER_ID) return;

			if(command.restrictions === 'guild' && !interaction.guild?.id) return interaction.reply({ content: 'This command can only be ran in servers!', ephemeral: true });
			if(command.restrictions === 'dms' && interaction.guild?.id) return interaction.reply({ content: 'This command can only be ran in DMs!', ephemeral: true });

			command.run(interaction);
		} catch (e) {
			interaction.reply({ content: 'There was an error running your command! Please try again', ephemeral: true });
			// if(button collector?) send error to db???
		}

	}

}