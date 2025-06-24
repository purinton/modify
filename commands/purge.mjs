// commands/purge.mjs
export default async function ({ log, msg }, interaction) {
    if (!interaction.memberPermissions.has('ManageMessages')) {
        log.warn('Purge command invoked by non-admin user:', interaction.user && interaction.user.id);
        const content = msg('purge_user_permission_missing', 'User is missing the manage messages permission.');
        return await interaction.reply({ content, flags: 1 << 6 });
    }
    if (!interaction.appPermissions.has('ManageMessages')) {
        log.warn('Purge command invoked by app without manage messages permission:', interaction.app && interaction.app.id);
        const content = msg('purge_app_permission_missing', 'App is missing the manage messages permission.');
        return await interaction.reply({ content, flags: 1 << 6 });
    }
    const amount = interaction.options.getInteger('amount');
    if (!amount || amount < 1 || amount > 100) {
        log.warn('Purge command invoked with invalid amount:', amount);
        const content = msg('purge_invalid_amount', 'Invalid purge amount. Must be between 1 and 100.');
        return await interaction.reply({ content, flags: 1 << 6 });
    }
    const contains = interaction.options.getString('contains');
    const onlyApps = interaction.options.getBoolean('apps');
    const onlyEmbeds = interaction.options.getBoolean('embeds');
    const user = interaction.options.getUser('user');
    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    let toDelete = Array.from(messages.values());
    if (user) toDelete = toDelete.filter(m => m.author.id === user.id);
    if (contains) toDelete = toDelete.filter(m => m.content.includes(contains));
    if (onlyApps) toDelete = toDelete.filter(m => m.author.bot);
    if (onlyEmbeds) toDelete = toDelete.filter(m => m.embeds && m.embeds.length > 0);
    toDelete = toDelete.slice(0, amount);
    if (toDelete.length === 0) {
        log.info(`No messages to purge in channel ${interaction.channel.id} by user ${interaction.user && interaction.user.id}`);
        const content = msg('purge_no_messages', 'No messages to delete.', log);
        return await interaction.reply({ content, flags: 1 << 6 });
    }
    await interaction.channel.bulkDelete(toDelete, true);
    log.info(`Purged ${toDelete.length} messages in channel ${interaction.channel.id} by user ${interaction.user && interaction.user.id}`);
    const content = `${msg('purge_success', 'Purged messages:')} ${toDelete.length}`;
    await interaction.reply({ content, flags: 1 << 6 });
}
