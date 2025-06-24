import { jest } from '@jest/globals';
import debug from '../../events/debug.mjs';

describe('debug event', () => {
  it('should log debug', async () => {
    const log = { debug: jest.fn() };
    await debug({ log }, 'debugging');
    expect(log.debug).toHaveBeenCalledWith('debug', { debug: 'debugging' });
  });
});
