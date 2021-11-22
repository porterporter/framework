import { Client as DClient } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import { container, StoreRegistry } from '@sapphire/pieces';
import { CommandStore } from '@lib/CommandStore';
import { ListenerStore } from '@lib/ListenerStore';
import { PreconditionStore } from '@lib/PreconditionStore';
import { join } from 'path';

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
			.register(new ListenerStore().registerPath(join(__dirname, '..', 'listeners')))
			.register(new PreconditionStore().registerPath(join(__dirname, '..', 'preconditions')));
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
		// this.stores.get('commands').forEach((command) => { console.log(command._options); });
		const commands = this.stores.get('commands').map(command => { return { name: command.name, description: command.description, options: command._options?.map((option) => option.toJSON()), defaultPermission: command.defaultPermission };});
		await this.application?.commands.fetch();
		const apiCommands = this.application?.commands.cache.map((command) => {
			return { name: command.name, description: command.description, options: command.options, defaultPermission: command.defaultPermission };
		});

		// const fetchCommands = await this.application?.commands.fetch();
		// fetchCommands?.forEach(async (command) => {
		// 	const permissions = this.stores.get('commands').get(command.name)?.permissions;
		// 	command.permissions.set(permissions);
		// });

		// if(arraysEqual(commands, apiCommands ?? [])) return;
		if(JSON.stringify(commands) === JSON.stringify(apiCommands ?? [])) return;

		console.log('Application (/) Commands Out Of Sync! Redeploying...');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.application.commands.set(commands);
	}
}

// const objectsEqual = (o1: Record<string, unknown>, o2: Record<string, unknown>) =>
// 	Object.keys(o1).length === Object.keys(o2).length
//         && Object.keys(o1).every(p => o1[p] === o2[p]);

// const arraysEqual = (a1: Record<string, unknown>[], a2: Record<string, unknown>[]) =>
// 	a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));