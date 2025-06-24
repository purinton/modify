import { jest } from '@jest/globals';
import ready from '../../events/ready.mjs';

describe('ready event', () => {
  it('should log ready and set presence', async () => {
    const log = { debug: jest.fn(), info: jest.fn() };
    const presence = { activities: [] };
    const client = { user: { tag: 'bot#1234', setPresence: jest.fn() } };
    await ready({ log, presence }, client);
    expect(log.debug).toHaveBeenCalledWith('ready', { tag: 'bot#1234' });
    expect(log.info).toHaveBeenCalledWith('Logged in as bot#1234');
    expect(client.user.setPresence).toHaveBeenCalledWith(presence);
  });
});
