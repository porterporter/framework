import type { Client } from '@lib/structures/Client';
import type { CommandStore } from '@stores/CommandStore';
import type { ListenerStore } from '@stores/ListenerStore';
import type { PreconditionStore } from '@stores/PreconditionStore';

declare module '@sapphire/pieces' {
    export interface Container {
        client: Client;
    }
    export interface StoreRegistryEntries {
		commands: CommandStore;
		events: ListenerStore;
    preconditions: PreconditionStore;
	}
}

declare namespace NodeJS {
    export interface ProcessEnv {
      OWNER: string;
      TOKEN?: string;

    }
  }