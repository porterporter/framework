import 'module-alias/register';
import { config } from 'dotenv';
config();

import { Client } from '@lib/Client';

const client = new Client();
client.login();
client.stores.forEach(store => console.log(store));