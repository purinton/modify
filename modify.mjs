#!/usr/bin/env node
import 'dotenv/config';
import { createDb } from '@purinton/mysql';
import { createOpenAI } from '@purinton/openai';
import { createDiscord } from '@purinton/discord';
import { loadLogChannelsAndLocales } from './src/logchannels.mjs';
import { log, fs, path, registerHandlers, registerSignals } from '@purinton/common';

registerHandlers({ log });
registerSignals({ log });

const packageJson = JSON.parse(fs.readFileSync(path(import.meta, 'package.json')), 'utf8');
const version = packageJson.version;
const presence = { activities: [{ name: `🤖 AI Mod v${version}`, type: 4 }], status: 'online' };
const db = await createDb({ log });
registerSignals({ shutdownHook: () => db.end() });

const { logChannels, guildLocales } = await loadLogChannelsAndLocales({ log, db });
const openai = await createOpenAI();
const client = await createDiscord({
    log,
    rootDir: path(import.meta),
    intents: { MessageContent: true },
    context: { db, openai, presence, version, logChannels, guildLocales }
});
registerSignals({ shutdownHook: () => client.destroy() });
