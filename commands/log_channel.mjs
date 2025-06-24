// commands/log_channel.mjs
export default async function ({ log, msg, db, logChannels, guildLocales }, interaction) {
    if (!interaction.memberPermissions.has('ManageGuild')) {
        log.warn('Log channel command invoked by non-admin user:', interaction.user && interaction.user.id);
        const content = msg('log_channel_admin_only', 'This command is for administrators only.');
        return await interaction.reply({ content, flags: 1 << 6 });
    }
    const channel = interaction.channel;
    if (!channel) {
        log.error('Log channel command invoked without a valid channel.');
        const content = msg('log_channel_no_channel', 'No valid channel found.');
        return await interaction.reply({ content, flags: 1 << 6 });
    }
    try {
        await db.execute(
            `INSERT INTO log_channels (guild_id, channel_id, guild_locale) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE channel_id = VALUES(channel_id), guild_locale = VALUES(guild_locale)`,
            [interaction.guild.id, channel.id, interaction.guild.preferredLocale]
        );
        logChannels[interaction.guild.id] = channel.id;
        guildLocales[interaction.guild.id] = interaction.guild.preferredLocale;
    } catch (err) {
        log.error('DB error:', err);
        const content = msg('log_channel_error', 'Failed to set log channel.');
        return await interaction.reply({ content, flags: 1 << 6 });
    }
    log.info(`Log channel set for guild ${interaction.guild.id} to ${channel.id}`);
    const content = `${msg('log_channel_confirm', 'Log channel set to')} <#${channel.id}>`;
    await interaction.reply({ content, flags: 1 << 6 });
}
