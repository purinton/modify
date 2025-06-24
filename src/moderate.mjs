export async function moderateMessage({ text = null, imageUrls = [], log, openai }) {
    log.debug("Moderating message content:", { text, imageUrls });
    const input = [];
    if (text && text.trim().length > 0) {
        input.push({ type: "text", text });
    }
    if (imageUrls.length > 0) {
        input.push({ type: "image_url", image_url: { url: imageUrls[0] } });
    }
    if (input.length === 0) return null;
    try {
        return await openai.moderations.create({
            model: "omni-moderation-latest",
            input
        });
    } catch (error) {
        log.error("Moderation API error:", error);
        throw error;
    }
}
