export async function loadLogChannelsAndLocales({ log, db }) {
    const logChannels = {};
    const guildLocales = {};
    try {
        const [rows] = await db.query('SELECT guild_id, channel_id, guild_locale FROM log_channels WHERE channel_id IS NOT NULL');
        for (const row of rows) {
            logChannels[row.guild_id] = row.channel_id;
            guildLocales[row.guild_id] = row.guild_locale;
        }
        log.debug(`Loaded ${Object.keys(logChannels).length} log channels and ${Object.keys(guildLocales).length} guild locales from DB`);
    } catch (err) {
        log.error('Failed to load log channels from DB:', err);
        throw err;
    }
    return { logChannels, guildLocales };
}
