// events/messageCreate.mjs
import { EmbedBuilder } from 'discord.js';
import { moderateMessage } from '../src/moderate.mjs';
export default async function ({ client, log, msg, openai, logChannels, guildLocales }, message, {
    moderateMessageFn = moderateMessage
} = {}) {
    log.debug('messageCreate', { id: message.id });
    const locale = message.guild?.preferredLocale || 'en-US';
    if (message.author.id === client.user.id) return;
    try {
        if (!message.guild || !message.guild.id) return;
        if (!logChannels || !logChannels[message.guild.id]) return;
        const text = message.cleanContent;
        const imageAttachments = (message.attachments ? Array.from(message.attachments.values()) : [])
            .filter(att => att.contentType && att.contentType.startsWith("image/"));
        const imageUrls = imageAttachments.map(att => att.url);
        if (!text && imageUrls.length === 0) return;
        const moderationPromises = [];
        if (text && text.trim().length > 0) {
            moderationPromises.push(
                moderateMessageFn({ text, imageUrls: [], log, openai }).then(moderation =>
                    moderation && moderation.results ? { moderation, type: 'text', text } : null
                )
            );
        }
        for (const url of imageUrls) {
            moderationPromises.push(
                moderateMessageFn({ text: '', imageUrls: [url], log, openai }).then(moderation =>
                    moderation && moderation.results ? { moderation, type: 'image', url } : null
                )
            );
        }
        const moderationResultsRaw = await Promise.all(moderationPromises);
        const moderationResults = moderationResultsRaw.filter(Boolean);
        const logChannelId = logChannels[message.guild.id];
        const categoryNames = msg(guildLocales[message.guild.id], 'categories', {}, log);
        const logChannel = await message.guild.channels.fetch(logChannelId).catch(() => null);
        if (!logChannel || !logChannel.isTextBased()) return;

        for (const { moderation, type, text, url } of moderationResults) {
            const flagged = moderation.results.filter(r => r.flagged);
            for (const result of flagged) {
                const cats = Object.entries(result.categories || {})
                    .filter(([cat, val]) => val)
                    .map(([cat]) => {
                        const score = result.category_scores?.[cat] || 0;
                        const name = categoryNames[cat] || cat;
                        return `• **${name}**: ${(score * 100).toFixed(1)}%`;
                    })
                    .join("\n");
                let embed;
                if (type === 'text') {
                    embed = new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle(message.url + ` • <t:${Math.floor(Date.now() / 1000)}:R>`)
                        .setDescription(`<@${message.author.id}>: ${text ? text.substring(0, 300) : '(no text)'}\n${cats}`)
                        .setTimestamp(message.createdAt)
                        .setFooter({ text: `User: ${message.author.tag} (${message.author.id})` });
                } else if (type === 'image') {
                    embed = new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle(message.url + ` • <t:${Math.floor(Date.now() / 1000)}:R>`)
                        .setDescription(`<@${message.author.id}>\n${cats}`)
                        .setImage(url)
                        .setTimestamp(message.createdAt)
                        .setFooter({ text: `User: ${message.author.tag} (${message.author.id})` });
                }
                await logChannel.send({ embeds: [embed] });
            }
        }
    } catch (err) {
        log.error("Moderation error:", { err });
        try {
            const logChannelId = logChannels[message.guild?.id];
            const logChannel = logChannelId ? await message.guild.channels.fetch(logChannelId).catch(() => null) : null;
            if (logChannel && logChannel.isTextBased()) {
                await logChannel.send({ content: `Moderation error: ${err?.message || err}` });
            }
        } catch (logErr) {
            log.error("Failed to send error to log channel:", { logErr });
        }
    }
}