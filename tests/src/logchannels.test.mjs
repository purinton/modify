import { jest } from '@jest/globals';
import { loadLogChannelsAndLocales } from '../../src/logchannels.mjs';

describe('loadLogChannelsAndLocales', () => {
    let log, db;
    beforeEach(() => {
        log = { debug: jest.fn(), error: jest.fn() };
        db = { query: jest.fn() };
    });

    it('should load log channels and locales from db', async () => {
        db.query.mockResolvedValue([[{ guild_id: 'g1', channel_id: 'c1', guild_locale: 'en-US' }]]);
        const result = await loadLogChannelsAndLocales({ log, db });
        expect(result.logChannels.g1).toBe('c1');
        expect(result.guildLocales.g1).toBe('en-US');
        expect(log.debug).toHaveBeenCalled();
    });

    it('should log and throw on db error', async () => {
        db.query.mockRejectedValue(new Error('fail'));
        await expect(loadLogChannelsAndLocales({ log, db })).rejects.toThrow('fail');
        expect(log.error).toHaveBeenCalled();
    });
});
