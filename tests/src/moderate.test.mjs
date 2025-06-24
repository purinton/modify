import { jest } from '@jest/globals';
import { moderateMessage } from '../../src/moderate.mjs';

describe('moderateMessage', () => {
    let log, openai;
    beforeEach(() => {
        log = { debug: jest.fn(), error: jest.fn() };
        openai = { moderations: { create: jest.fn() } };
    });

    it('should return null if no input', async () => {
        const result = await moderateMessage({ text: '', imageUrls: [], log, openai });
        expect(result).toBeNull();
    });

    it('should call openai.moderations.create for text', async () => {
        openai.moderations.create.mockResolvedValue({ results: [] });
        await moderateMessage({ text: 'test', imageUrls: [], log, openai });
        expect(openai.moderations.create).toHaveBeenCalled();
    });

    it('should call openai.moderations.create for image', async () => {
        openai.moderations.create.mockResolvedValue({ results: [] });
        await moderateMessage({ text: '', imageUrls: ['url'], log, openai });
        expect(openai.moderations.create).toHaveBeenCalled();
    });

    it('should throw and log error on API error', async () => {
        openai.moderations.create.mockRejectedValue(new Error('fail'));
        await expect(moderateMessage({ text: 'test', imageUrls: [], log, openai })).rejects.toThrow('fail');
        expect(log.error).toHaveBeenCalled();
    });
});
