import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandOptions } from '@structures/Command';
import type { PieceContext } from '@sapphire/pieces';
import type { CommandInteraction, Message } from 'discord.js';

export class interactionCreate extends Command {
	constructor(context: PieceContext, options: CommandOptions) {
		super(context, {
			...options,
			data: new SlashCommandBuilder()
				.setName('reset')
				.setDescription('resets all slash commands'),
			cooldown: 2000,
		});
	}

	public async run(interaction: CommandInteraction): Promise<unknown> {
		const ping = await interaction.reply({ content: ':beverage_box:', allowedMentions: { repliedUser: false }, fetchReply: true }) as Message;
		return await interaction.editReply(`:ping_pong:\n<:websocketapilatency:877568852194635796> ${Math.round(this.container.client.ws.ping)}ms. <:roundtripmessagelatency:877568584690323556> ${(ping.createdTimestamp) - interaction.createdTimestamp}ms.`);
	}
}