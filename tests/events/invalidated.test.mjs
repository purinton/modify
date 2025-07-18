import { jest } from '@jest/globals';
import invalidated from '../../events/invalidated.mjs';

describe('invalidated event', () => {
  it('should log debug', async () => {
    const log = { debug: jest.fn() };
    await invalidated({ log });
    expect(log.debug).toHaveBeenCalledWith('invalidated');
  });
});
