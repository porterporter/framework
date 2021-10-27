import { Client as DClient } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import { container, StoreRegistry } from '@sapphire/pieces';
import { CommandStore } from '@lib/CommandStore';
import { ListenerStore } from '@lib/ListenerStore';
import { join } from 'path';
import type { simpleCommand } from '@lib/Command';


export class Client extends DClient {

	public stores: StoreRegistry;

	constructor(options?: ClientOptions) {
		super({ ...options,
			intents: [
				'GUILDS',
				'GUILD_MESSAGES',
				'DIRECT_MESSAGES',
			],
			partials: [
				'CHANNEL',
				'USER',
				'MESSAGE',
				'REACTION',
			],
			ws: { properties: { $browser: 'Discord iOS' } },
		});
		container.client = this;

		this.stores = new StoreRegistry();
		container.stores = this.stores;

		this.stores
			.register(new CommandStore().registerPath(join(__dirname, '..', 'commands')))
			.register(new ListenerStore().registerPath(join(__dirname, '..', 'listeners')));
	}

	public async login(token?: string) {
		await Promise.all([...this.stores.values()].map((store) => store.loadAll()));
		await this.loadEvents();
		return super.login(token ??= process.env.DISCORD_TOKEN);
	}

	public async loadEvents() {
		this.stores.get('events').forEach((event) => {
			event.once ? this.once(event.event, (...args) => event.run(...args)) : this.on(event.event, (...args) => event.run(...args));
		});
	}

	public async loadCommands() {
		let commands: simpleCommand[] = [];
		this.stores.get('commands').forEach((command) => {
			commands = [ ...commands, { name: command.name, description: command.description, options: command.discordOptions.options, defaultPermission: command.discordOptions.defaultPermission }];
		});
		const fetchedCommands = await this.application?.commands.fetch();
		const publicCommands = fetchedCommands?.map((element) => {
			if(element.guild) return;
			return {
				name: element.name,
				description: element.description,
				options: element.options,
				defaultPermission: true,
			};
		});
		if(JSON.stringify(publicCommands?.sort()) !== JSON.stringify(commands.sort())) {
			console.log('Application commands out of sync! Redeploying now.');
			try {
				await this.application?.commands.set(commands);
				console.log('Successfully deployed application commands.');
			} catch (e) {
				console.log('Error deploying slash commands!');
			}
		}

	}
}