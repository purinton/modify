import { jest } from '@jest/globals';
import Evaluate from '../../commands/Evaluate.mjs';

describe('Evaluate command', () => {
  let log, msg, openai, interaction, moderateMessageFn;
  beforeEach(() => {
    log = { error: jest.fn() };
    msg = jest.fn((key, def) => def);
    openai = {};
    moderateMessageFn = jest.fn();
    interaction = {
      targetMessage: { cleanContent: 'test', attachments: new Map() },
      reply: jest.fn(),
      followUp: jest.fn()
    };
  });

  it('should reply if no target message', async () => {
    interaction.targetMessage = null;
    await Evaluate({ log, msg, openai }, interaction, { moderateMessageFn });
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should reply if no content or images', async () => {
    interaction.targetMessage = { cleanContent: '', attachments: new Map() };
    await Evaluate({ log, msg, openai }, interaction, { moderateMessageFn });
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should reply if no moderation results', async () => {
    moderateMessageFn.mockResolvedValue({ results: [] });
    await Evaluate({ log, msg, openai }, interaction, { moderateMessageFn });
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should reply with moderation results', async () => {
    moderateMessageFn.mockResolvedValue({ results: [{ category_scores: { hate: 0.5 }, flagged: true }] });
    await Evaluate({ log, msg, openai }, interaction, { moderateMessageFn });
    expect(interaction.reply).toHaveBeenCalled();
  });

  it('should handle moderation error', async () => {
    moderateMessageFn.mockRejectedValue(new Error('fail'));
    await Evaluate({ log, msg, openai }, interaction, { moderateMessageFn });
    expect(log.error).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });
});
