// events/messageUpdate.mjs
import { moderateMessage } from '../src/moderate.mjs';
import handleMessageCreate from './messageCreate.mjs';
export default async function ({ client, log, msg, openai, logChannels, guildLocales }, oldMessage, newMessage, {
    moderateMessageFn = moderateMessage
} = {}) {
    log.debug('messageUpdate', { oldMessage, newMessage });
    await handleMessageCreate({ client, log, msg, openai, logChannels, guildLocales }, newMessage, { moderateMessageFn });
}