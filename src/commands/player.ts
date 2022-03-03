import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, CommandOptions } from '@structures/Command';
import type { PieceContext } from '@sapphire/pieces';
import { ColorResolvable, CommandInteraction, Util } from 'discord.js';
import { error, reply } from '@lib/utils/discord/utils';
import { fetch } from 'undici';


export class interactionCreate extends Command {
	constructor(context: PieceContext, options: CommandOptions) {
		super(context, {
			...options,
			data: new SlashCommandBuilder()
				.setName('player')
				.setDescription('get account info for a minecraft player!')
				.addStringOption(o =>
					o.setName('username')
						.setDescription('the minecraft ign of the player you\'d like to find')
						.setRequired(true)),
			cooldown: 2000,
		});
	}

	public async run(interaction: CommandInteraction) {
		const username = await interaction.options.getString('username', true);

		const request = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
		if (!request.ok) {
			return error(interaction, 'That does not seem to be a valid player username or uuid');
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data = await request.json() as any;

		const embed = {
			color: '#ff8c00' as ColorResolvable,
			title: 'Player Info',
			fields: [
				{ name: 'Username', value: data.username, inline: false },
				{ name: 'UUID', value: data.uuid.replace(/-/g, ''), inline: false },
				...(data.created_at) ? [{ name: 'Created', value: `<t:${Math.floor(new Date(data.created_at).getTime() / 1000)}:R>`, inline: false }] : [],
				{
					name: 'Username History', value: Util.escapeMarkdown(data.username_history.map((element: { username: string }) => element.username).reverse().join('\n')), inline: false,
				},
			],
			image: { url: `https://mc-heads.net/body/${data.uuid}/128.png` },
			...(data.created_at) ? { footer: { text: 'Account creation date may be incorrect!' } } : {},

		};
		return reply(interaction, { embeds: [embed] });
	}
}