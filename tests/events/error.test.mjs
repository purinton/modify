import { jest } from '@jest/globals';
import error from '../../events/error.mjs';

describe('error event', () => {
  it('should log error', async () => {
    const log = { error: jest.fn() };
    const err = new Error('fail');
    await error({ log }, err);
    expect(log.error).toHaveBeenCalledWith('error', { error: err });
  });
});
