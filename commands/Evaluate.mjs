import { moderateMessage } from "../src/moderate.mjs";

// commands/Evaluate.mjs
export default async function ({ log, msg, openai }, interaction, {
    moderateMessageFn = moderateMessage
} = {}) {
    const targetMessage = interaction.targetMessage;
    if (!targetMessage) return await interaction.reply({ content: msg('evaluate_no_message', 'No message found to evaluate.'), flags: 1 << 6 });
    const categoryNames = msg('categories', {});
    const text = targetMessage.cleanContent;
    const imageAttachments = (targetMessage.attachments ? Array.from(targetMessage.attachments.values()) : [])
        .filter(att => att.contentType && att.contentType.startsWith("image/"));
    const imageUrls = imageAttachments.map(att => att.url);
    if (!text && imageUrls.length === 0) return await interaction.reply({ content: msg('evaluate_error', 'No messages or images to evaluate.'), flags: 1 << 6 });
    try {
        const moderationPromises = [];
        if (text && text.trim().length > 0) moderationPromises.push(moderateMessageFn({ text, log, openai }).then(moderation => ({ moderation, type: 'text', text })));
        for (const url of imageUrls) moderationPromises.push(moderateMessageFn({ imageUrls: [url], log, openai }).then(moderation => ({ moderation, type: 'image', url })));
        const moderationResultsRaw = await Promise.all(moderationPromises);
        const moderationResults = moderationResultsRaw.filter(r => r.moderation && r.moderation.results && r.moderation.results.length);
        if (moderationResults.length === 0) return await interaction.reply({ content: msg('evaluate_no_results', 'No moderation results.'), flags: 1 << 6 });
        let first = true;
        for (const { moderation, type, text, url } of moderationResults) {
            const result = moderation.results[0];
            let results = Object.entries(result.category_scores || {})
                .map(([key, value]) => {
                    const formattedScore = Math.round(value * 100) + "%";
                    const category = categoryNames[key] || key;
                    return `${category}: ${formattedScore}`;
                })
                .join("\n");
            results = results.trim();
            if (first) {
                await interaction.reply({ content: results, flags: 1 << 6 });
                first = false;
            } else {
                await interaction.followUp({ content: results, flags: 1 << 6 });
            }
        }
    } catch (err) {
        log.error("Moderation error:", err);
        await interaction.reply({ content: msg('evaluate_moderation_error', 'Moderation error.'), flags: 1 << 6 });
    }
}
