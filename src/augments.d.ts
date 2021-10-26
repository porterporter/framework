import type { Client } from '@lib/Client';
import type { Command } from '@lib/Command';
import Collection from '@discordjs/collection';


declare module '@sapphire/pieces' {
    export interface Container {
        client: Client;
		data: {
			commands: Collection<string, Command>;
		}
    }
}