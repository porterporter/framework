import type { CommandInteraction, ReplyMessageOptions } from 'discord.js';

export async function reply(interaction: CommandInteraction, options: (string | ReplyMessageOptions)) {
	return await interaction.reply(options instanceof Object ? { ...options, allowedMentions: { parse: [] } } : { content: options, allowedMentions: { parse: [] } });
}

export async function error(interaction: CommandInteraction, options: (string | ReplyMessageOptions)) {
	return await interaction.reply(options instanceof Object ? { ...options, allowedMentions: { parse: [] }, ephemeral: true } : { content: options, allowedMentions: { parse: [] }, ephemeral: true });
}
