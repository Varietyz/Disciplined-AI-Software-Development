import type { Attachment, Embed, EmbedField } from "#types/discord.types";
import { DURATION_FIELD, FAILED_AT_FIELD, FINISHED_FIELD } from "#configuration/strings/notification.strings";
import type { Journal, Span } from "#types/deployment.types";
import { MS_PER_SECOND, THUMBNAIL_URL } from "#configuration/constants/deployment.constants";
import { NOTIFIED, NOTIFYING, NOTIFY_FAILED, SECONDS_SUFFIX } from "#configuration/strings/deployment.strings";
import { code, relative } from "#core/converters/markdown.converter";
import { formatDuration } from "#core/converters/text.converter";
import { messageOf } from "#core/converters/failure.converter";
import { postWebhook } from "#core/adapters/webhook.adapter";

export const field = function field(name: string, value: string, inline = false): EmbedField {
    return { inline, name, value };
};

export const timing = function timing(span: Span, ok: boolean): readonly EmbedField[] {
    return [
        field(DURATION_FIELD, code(formatDuration(span.finishedAt - span.startedAt) + SECONDS_SUFFIX), true),
        field(ok ? FINISHED_FIELD : FAILED_AT_FIELD, relative(Math.floor(span.finishedAt / MS_PER_SECOND)), true),
    ];
};

export const embed = function embed(title: string, color: number, fields: readonly EmbedField[]): Embed {
    return { color, fields, thumbnail: { url: THUMBNAIL_URL }, timestamp: new Date().toISOString(), title };
};

export const notify = async function notify(
    journal: Journal,
    url: string,
    content: string,
    message: Embed,
    attachment: Attachment | null = null,
): Promise<boolean> {
    journal.log(NOTIFYING);
    try {
        await postWebhook(url, { attachment, content, embed: message });
        journal.log(NOTIFIED);
        return true;
    } catch (error: unknown) {
        journal.error(NOTIFY_FAILED + messageOf(error));
        return false;
    }
};
