import type { Command } from '@lib/structures/Command';
import { Listener, ListenerOptions } from '@lib/structures/Listener';
import { error } from '@lib/utils/discord/utils';
import type { PieceContext } from '@sapphire/pieces';
import type { TextChannel, NewsChannel } from 'discord.js';
import { CommandInteraction, Permissions } from 'discord.js';
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

			const missingClientPermissions = this.clientPermissions(command, interaction) ?? [];
			const missingUserPermissions = this.userPermissions(command, interaction) ?? [];

			if(missingClientPermissions.length) return error(interaction, `I'm missing the following permissions in this channel:\n${missingClientPermissions.map((perm) => `\t- ${perm}`).join('\n')}`);
			if(missingUserPermissions.length) return error(interaction, `You're missing the following permissions in this channel:\n${missingUserPermissions.map((perm) => `\t- ${perm}`).join('\n')}`);

			const errors = await this.runPreconditions(command, interaction);
			if(!errors.length) return command.run(interaction);

			return interaction.reply({ content: `There was ${errors.length > 1 ? 'errors' : 'an error'} running your command!\n${errors.map((err) => `\t- ${err}`).join('\n')}`, ephemeral: true });

		} catch (e) {
			console.log(e);
			interaction.reply({ content: 'There was an error running your command! Please try again', ephemeral: true });
		}
	}

	private userPermissions(command: Command, interaction: CommandInteraction) {
		const requiredUserPermissions = new Permissions(command.userPermissions);
		const channel = interaction.channel as TextChannel | NewsChannel;
		const permissions = interaction.guild ? channel.permissionsFor(interaction.user) : DMPermissions;
		if(!permissions) return null;

		return permissions.missing(requiredUserPermissions);

	}

	private clientPermissions(command: Command, interaction: CommandInteraction) {
		const requiredClientPermissions = new Permissions(command.clientPermissions);
		const channel = interaction.channel as TextChannel | NewsChannel;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const permissions = interaction.guild ? channel.permissionsFor(interaction.client.user!) : DMPermissions;
		if(!permissions) return null;

		return permissions.missing(requiredClientPermissions);
	}

	private async runPreconditions(command: Command, interaction: CommandInteraction) {
		const errors = [];
		for(const preconditionName of command.preconditions) {
			const precondition = await this.container.stores.get('preconditions').get(preconditionName);

			if(!precondition) continue;
			const run = await precondition.run(interaction);
			if(!run.pass) errors.push(run.reason);
		}
		return errors.filter(v => v);
	}
}

export const DMPermissions = new Permissions(
	~new Permissions([
		'ADD_REACTIONS',
		'ATTACH_FILES',
		'EMBED_LINKS',
		'READ_MESSAGE_HISTORY',
		'SEND_MESSAGES',
		'USE_EXTERNAL_EMOJIS',
		'VIEW_CHANNEL',
		'USE_EXTERNAL_STICKERS',
		'MENTION_EVERYONE',
	]).bitfield & Permissions.ALL,
).freeze();