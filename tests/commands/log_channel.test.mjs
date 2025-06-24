import { jest } from '@jest/globals';
import log_channel from '../../commands/log_channel.mjs';

describe('log_channel command', () => {
  let log, msg, db, logChannels, guildLocales, interaction;
  beforeEach(() => {
    log = { warn: jest.fn(), error: jest.fn(), info: jest.fn() };
    msg = jest.fn((key, def) => def);
    db = { execute: jest.fn() };
    logChannels = {};
    guildLocales = {};
    interaction = {
      memberPermissions: { has: jest.fn(() => true) },
      channel: { id: 'c1' },
      guild: { id: 'g1', preferredLocale: 'en-US' },
      user: { id: 'u1' },
      reply: jest.fn()
    };
  });

  it('should reject if user is not admin', async () => {
    interaction.memberPermissions.has = jest.fn(() => false);
    await log_channel({ log, msg, db, logChannels, guildLocales }, interaction);
    expect(log.warn).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should reject if no channel', async () => {
    interaction.channel = null;
    await log_channel({ log, msg, db, logChannels, guildLocales }, interaction);
    expect(log.error).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should handle db error', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await log_channel({ log, msg, db, logChannels, guildLocales }, interaction);
    expect(log.error).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should set log channel', async () => {
    await log_channel({ log, msg, db, logChannels, guildLocales }, interaction);
    expect(db.execute).toHaveBeenCalled();
    expect(logChannels['g1']).toBe('c1');
    expect(guildLocales['g1']).toBe('en-US');
    expect(interaction.reply).toHaveBeenCalled();
  });
});
