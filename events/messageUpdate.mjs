// events/messageUpdate.mjs
import { moderateMessage } from '../src/moderate.mjs';
import handleMessageCreate from './messageCreate.mjs';
export default async function ({ log, msg, openai, logChannels, guildLocales }, oldMessage, newMessage, {
    moderateMessageFn = moderateMessage
} = {}) {
    log.debug('messageUpdate', { oldMessage, newMessage });
    await handleMessageCreate({ log, msg, openai, logChannels, guildLocales }, newMessage, { moderateMessageFn });
}