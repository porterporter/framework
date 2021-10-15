import { Event } from '@lib/Event';
import { box } from '@lib/box';


import type { CommandInteraction } from 'discord.js';
export class interactionCreate extends Event {
	constructor() {
		super({
			name: 'interactionCreate',
			event: 'interactionCreate',
		});
	}

	public async run(interaction: CommandInteraction) {
		try {
			const command = box.data.commands.get(interaction.commandName);
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