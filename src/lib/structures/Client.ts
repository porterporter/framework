import { Client as DClient } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import { container, StoreRegistry } from '@sapphire/pieces';
import { CommandStore } from '@stores/CommandStore';
import { ListenerStore } from '@stores/ListenerStore';
import { PreconditionStore } from '@stores/PreconditionStore';
import { join } from 'path';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';


export class Client extends DClient {

	public stores: StoreRegistry;
	private routes: REST;

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
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.routes = new REST({ version: '9' }).setToken(this.token!);

		this.stores = new StoreRegistry();
		container.stores = this.stores;

		this.stores
			.register(new CommandStore().registerPath(join(__dirname, '..', '..', 'commands')))
			.register(new ListenerStore().registerPath(join(__dirname, '..', '..', 'listeners')))
			.register(new PreconditionStore().registerPath(join(__dirname, '..', '..', 'preconditions')));
	}

	public async login(token?: string) {
		await Promise.all([...this.stores.values()].map((store) => store.loadAll()));
		await this.loadEvents();
		console.log(this.stores.get('events').size);
		return super.login(token ??= process.env.DISCORD_TOKEN);
	}

	public async loadEvents() {
		this.stores.get('events').forEach((event) => {
			event.once ? this.once(event.event, (...args) => event.run(...args)) : this.on(event.event, (...args) => event.run(...args));
		});
	}

	public async loadCommands() {
		// const commands = this.stores.get('commands').map(command => { return { name: command.name, description: command.description, options: command._options?.map((option) => option.toJSON()) };});
		// await this.application?.commands.fetch();
		// const apiCommands = this.application?.commands.cache.map((command) => {
		// 	return { name: command.name, description: command.description, options: command.options, defaultPermission: command.defaultPermission };
		// });


		// if(JSON.stringify(commands) === JSON.stringify(apiCommands ?? [])) return;

		// console.log('Application (/) Commands Out Of Sync! Redeploying...');
		// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// // @ts-ignore this does and SHOULD work... why it doesnt i have no dea
		// this.application.commands.set(commands);

		const commands = this.stores.get('commands').map(c => c.data.toJSON());

		await this.routes.put(
			Routes.applicationGuildCommands(this.user?.id ?? '0', '750607294433067030'),
			{ body: commands },
		);

		// await this.routes.put(
		// 	Routes.applicationCommands(this.user?.id ?? '0'),
		// 	{ body: commands },
		// );
	}
}

// const objectsEqual = (o1: Record<string, unknown>, o2: Record<string, unknown>) =>
// 	Object.keys(o1).length === Object.keys(o2).length
//         && Object.keys(o1).every(p => o1[p] === o2[p]);

// const arraysEqual = (a1: Record<string, unknown>[], a2: Record<string, unknown>[]) =>
// 	a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));