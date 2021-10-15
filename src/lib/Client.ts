import { Client as DClient } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import { box } from '@juiceboy/global-box';
import Collection from '@discordjs/collection';
import type { Command } from '@lib/Command';

export class Client extends DClient {
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
		box.client = this;
		box.data = {
			commands: new Collection<string, Command>(),
		};


	}

	public login(token?: string) {
		token ??= process.env.DISCORD_TOKEN;
		return super.login(token);
	}
}

declare module '@juiceboy/global-box' {
	export interface Box {
		client: Client;
		data: {
			commands: Collection<string, Command>;
		}
	}
}