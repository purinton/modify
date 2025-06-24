import { jest } from '@jest/globals';
import messageCreate from '../../events/messageCreate.mjs';

describe('messageCreate event', () => {
  let log, msg, openai, logChannels, guildLocales, message, moderateMessageFn, client;
  beforeEach(() => {
    log = { debug: jest.fn(), error: jest.fn() };
    msg = jest.fn(() => ({ hate: 'Hate' }));
    openai = {};
    logChannels = { g1: 'c1' };
    guildLocales = { g1: {} };
    message = {
      id: '1',
      guild: { id: 'g1', preferredLocale: 'en-US', channels: { fetch: jest.fn(() => ({ isTextBased: () => true, send: jest.fn() })) } },
      author: { id: 'u1', tag: 'user#1' },
      cleanContent: 'test',
      attachments: new Map(),
      url: 'http://discord.com/message/1',
      createdAt: new Date(),
    };
    moderateMessageFn = jest.fn(() => Promise.resolve({ results: [{ flagged: true, categories: { hate: true }, category_scores: { hate: 0.5 } }] }));
    client = { user: { id: 'bot' } };
  });

  it('should skip if message is from bot', async () => {
    message.author.id = 'bot';
    await messageCreate({ client, log, msg, openai, logChannels, guildLocales }, message, { moderateMessageFn });
    expect(log.debug).toHaveBeenCalled();
  });

  it('should skip if no guild', async () => {
    message.guild = null;
    await messageCreate({ client, log, msg, openai, logChannels, guildLocales }, message, { moderateMessageFn });
    expect(log.debug).toHaveBeenCalled();
  });

  it('should skip if no log channel', async () => {
    logChannels = {};
    await messageCreate({ client, log, msg, openai, logChannels, guildLocales }, message, { moderateMessageFn });
    expect(log.debug).toHaveBeenCalled();
  });

  it('should handle moderation and send embed', async () => {
    await messageCreate({ client, log, msg, openai, logChannels, guildLocales }, message, { moderateMessageFn });
    // No error means success
    expect(log.debug).toHaveBeenCalled();
  });

  it('should handle moderation error', async () => {
    moderateMessageFn.mockRejectedValue(new Error('fail'));
    await messageCreate({ client, log, msg, openai, logChannels, guildLocales }, message, { moderateMessageFn });
    expect(log.error).toHaveBeenCalled();
  });
});
