import type { Attachment, Embed, EmbedField } from "#types/discord.types";
import {
    DURATION_FIELD,
    ERROR_FIELD,
    FAILED_AT_FIELD,
    FAILURE_ATTACHED,
    FINISHED_FIELD,
} from "#configuration/strings/notification.strings";
import { FAILURE_ATTACHMENT, FIELD_VALUE_LIMIT } from "#configuration/constants/discord.constants";
import type { Journal, Span } from "#types/deployment.types";
import { LINE_BREAK, MS_PER_SECOND, THUMBNAIL_URL } from "#configuration/constants/deployment.constants";
import { NOTIFIED, NOTIFYING, NOTIFY_FAILED, SECONDS_SUFFIX } from "#configuration/strings/deployment.strings";
import { code, fenced, lines, relative } from "#core/converters/markdown.converter";
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

const fitsField = function fitsField(failure: string): boolean {
    return fenced(failure).length <= FIELD_VALUE_LIMIT;
};

export const failureField = function failureField(failure: string): EmbedField {
    if (fitsField(failure)) {
        return field(ERROR_FIELD, fenced(failure));
    }
    const room = FIELD_VALUE_LIMIT - fenced("").length - LINE_BREAK.length - FAILURE_ATTACHED.length;
    const head = failure.slice(0, room);
    const cut = head.lastIndexOf(LINE_BREAK);
    const shown = fenced(cut > 0 ? head.slice(0, cut) : head);
    return field(ERROR_FIELD, lines([shown, FAILURE_ATTACHED]));
};

export const failureAttachment = function failureAttachment(failure: string): Attachment | null {
    return fitsField(failure) ? null : { content: failure, name: FAILURE_ATTACHMENT };
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
