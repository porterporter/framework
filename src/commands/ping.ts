import { Command, CommandOptions } from '@lib/Command';
import type { PieceContext } from '@sapphire/pieces';

import { CommandInteraction, Message } from 'discord.js';
export class interactionCreate extends Command {
	constructor(context: PieceContext, options: CommandOptions) {
		super(context, {
			...options,
			name: 'ping',
			description: 'Display the bots latency and websocket ping.',
		});
	}

	public async run(interaction: CommandInteraction) {
		const ping = await interaction.reply({ content: ':beverage_box:', allowedMentions: { repliedUser: false }, fetchReply: true });
		return (ping instanceof Message) ?
			interaction.editReply(`:ping_pong:\n<:websocketapilatency:877568852194635796> ${Math.round(this.container.client.ws.ping)}ms. <:roundtripmessagelatency:877568584690323556> ${(ping.createdTimestamp) - interaction.createdTimestamp}ms.`)
			: interaction.editReply(`:ping_pong:\n<:websocketapilatency:877568852194635796> ${Math.round(this.container.client.ws.ping)}ms.`);
	}
}