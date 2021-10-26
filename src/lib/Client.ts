import { Client as DClient } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import Collection from '@discordjs/collection';
import type { Command } from '@lib/Command';
import { container, StoreRegistry } from '@sapphire/pieces';
import { CommandStore } from '@lib/CommandStore';
import { ListenerStore } from '@lib/ListenerStore';
import { join } from 'path';


export class Client extends DClient {

	public stores: StoreRegistry;

	constructor(options?: ClientOptions) {
		super({ ...options,
			intents: [
				'GUILDS',
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
		container.data = {
			commands: new Collection<string, Command>(),
		};

		this.stores = new StoreRegistry();
		container.stores = this.stores;

		this.stores
			.register(new CommandStore().registerPath(join(__dirname, '..', 'commands')))
			.register(new ListenerStore().registerPath(join(__dirname, '..', 'listeners')));
	}

	public async login(token?: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await Promise.all([...this.stores.values()].map((store: any) => store.loadAll()));
		return super.login(token ??= process.env.DISCORD_TOKEN);
	}
}