import { jest } from '@jest/globals';
import purge from '../../commands/purge.mjs';

describe('purge command', () => {
  let log, msg, interaction;
  beforeEach(() => {
    log = { warn: jest.fn(), info: jest.fn() };
    msg = jest.fn((key, def) => def);
    interaction = {
      memberPermissions: { has: jest.fn(() => true) },
      appPermissions: { has: jest.fn(() => true) },
      options: {
        getInteger: jest.fn(() => 10),
        getString: jest.fn(() => null),
        getBoolean: jest.fn(() => false),
        getUser: jest.fn(() => null)
      },
      channel: { messages: { fetch: jest.fn(() => new Map([['1', { author: { id: 'u1', bot: false }, content: 'test', embeds: [] }]])) }, bulkDelete: jest.fn() },
      reply: jest.fn(),
      user: { id: 'u1' },
      app: { id: 'a1' }
    };
  });

  it('should reject if user lacks permission', async () => {
    interaction.memberPermissions.has = jest.fn(() => false);
    await purge({ log, msg }, interaction);
    expect(log.warn).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should reject if app lacks permission', async () => {
    interaction.appPermissions.has = jest.fn(() => false);
    await purge({ log, msg }, interaction);
    expect(log.warn).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should reject invalid amount', async () => {
    interaction.options.getInteger = jest.fn(() => 0);
    await purge({ log, msg }, interaction);
    expect(log.warn).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should handle no messages to delete', async () => {
    interaction.channel.messages.fetch = jest.fn(() => new Map());
    await purge({ log, msg }, interaction);
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should bulk delete messages', async () => {
    await purge({ log, msg }, interaction);
    expect(interaction.channel.bulkDelete).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });
});
