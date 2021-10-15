import 'module-alias/register';
import { config } from 'dotenv';
config();

import { box } from '@juiceboy/global-box';
import { join } from 'path';
import { isCommand, isEvent } from './lib/utilities/utils';
import readdirp from 'readdirp';
import { Client } from '@lib/Client';

const client = new Client();
client.login();


main();
async function main() {
	for await (const file of readdirp(join(__dirname, 'commands'), { fileFilter: '*.js' })) {
		const preload = await import(file.fullPath);
		if (isCommand(preload)) {
			box.data.commands.set(preload.name, preload);
		}

		for (const value of Object.values(preload)) {
			if (isCommand(value)) {
				box.data.commands.set(value.name, value);
			}
		}
	}

	for await (const file of readdirp(join(__dirname, 'listeners'), { fileFilter: '*.js' })) {
		const preload = await import(file.fullPath);
		if (isEvent(preload)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			client[preload.once ? 'once' : 'on'](preload.name, (...args: any[]) => preload.run(...args));
		}
	}

}