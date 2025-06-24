import { jest } from '@jest/globals';
import help from '../../commands/help.mjs';

describe('help command', () => {
  let log, msg, interaction;
  beforeEach(() => {
    log = { debug: jest.fn() };
    msg = jest.fn((key, def) => def);
    interaction = { reply: jest.fn() };
  });

  it('should reply with help text', async () => {
    await help({ log, msg }, interaction);
    expect(log.debug).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });
});
