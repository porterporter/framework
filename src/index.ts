import 'module-alias/register';
import { config } from 'dotenv';
config();

import { Client } from '@lib/structures/Client';

const client = new Client();
client.login();
