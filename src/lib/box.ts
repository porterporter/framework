import Collection from '@discordjs/collection';
import type { Command } from '@lib/Command';
import type { Client } from './Client';

export interface Box {
    client?: Client;
    data: DataPiece,
}

export const box: Box = {
	data: {
		commands: new Collection<string, Command>(),
	},
};

export interface DataPiece {
    commands: Collection<string, Command>,
}