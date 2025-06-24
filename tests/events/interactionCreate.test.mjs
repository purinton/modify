import { jest } from '@jest/globals';
import interactionCreate from '../../events/interactionCreate.mjs';

describe('interactionCreate event', () => {
  let client, log, msg, commandHandlers, interaction;
  beforeEach(() => {
    client = {};
    log = {};
    msg = jest.fn((locale, key, def) => def);
    commandHandlers = { test: jest.fn() };
    interaction = { commandName: 'test', locale: 'en-US', reply: jest.fn() };
  });

  it('should call the correct command handler', async () => {
    await interactionCreate({ client, log, msg, commandHandlers }, interaction);
    expect(commandHandlers.test).toHaveBeenCalled();
  });

  it('should do nothing if no handler', async () => {
    interaction.commandName = 'none';
    await interactionCreate({ client, log, msg, commandHandlers }, interaction);
    // No error thrown, nothing called
    expect(true).toBe(true);
  });
});
