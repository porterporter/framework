import { Client as DClient } from 'discord.js';
import type { ClientOptions } from 'discord.js';
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

		this.stores = new StoreRegistry();
		container.stores = this.stores;

		this.stores
			.register(new CommandStore().registerPath(join(__dirname, '..', 'commands')))
			.register(new ListenerStore().registerPath(join(__dirname, '..', 'listeners')));
	}

	public async login(token?: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await Promise.all([...this.stores.values()].map((store: any) => store.loadAll()));
		this.loadEvents();
		return super.login(token ??= process.env.DISCORD_TOKEN);
	}

	public async loadEvents() {
		this.stores.get('events').forEach((event) => {
			event.once ? this.once(event.event, event.run.bind(this)) : this.on(event.event, event.run.bind(this));
		});
	}
}