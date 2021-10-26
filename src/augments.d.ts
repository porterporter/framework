import type { Client } from '@lib/Client';
import type { CommandStore } from '@lib/CommandStore';
import type { ListenerStore } from '@lib/ListenerStore';

declare module '@sapphire/pieces' {
    export interface Container {
        client: Client;
    }
    interface StoreRegistryEntries {
		commands: CommandStore;
		events: ListenerStore;
	}
}
