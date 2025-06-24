import { jest } from '@jest/globals';
import messageUpdate from '../../events/messageUpdate.mjs';

describe('messageUpdate event', () => {
  it('should call handleMessageCreate', async () => {
    const log = { debug: jest.fn() };
    const msg = jest.fn();
    const openai = {};
    const logChannels = {};
    const guildLocales = {};
    const oldMessage = { id: '1' };
    const newMessage = { id: '2', author: { id: 'u1' }, guild: { id: 'g1', preferredLocale: 'en-US', channels: { fetch: jest.fn(() => ({ isTextBased: () => true, send: jest.fn() })) } } };
    const moderateMessageFn = jest.fn();
    const client = { user: { id: 'bot' } };
    // Patch messageUpdate to pass client to handleMessageCreate
    await messageUpdate({ client, log, msg, openai, logChannels, guildLocales }, oldMessage, newMessage, { moderateMessageFn });
    expect(log.debug).toHaveBeenCalled();
  });
});
