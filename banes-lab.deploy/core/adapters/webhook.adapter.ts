import {
    ATTACHMENT_FIELD,
    ATTACHMENT_TYPE,
    JSON_TYPE,
    PAYLOAD_FIELD,
} from "#configuration/constants/discord.constants";
import type { Attachment, WebhookMessage, WebhookRequest } from "#types/discord.types";

const CONTENT_TYPE = "Content-Type";
const METHOD = "POST";

const payloadOf = function payloadOf(message: WebhookMessage): string {
    return JSON.stringify({ content: message.content, embeds: [message.embed] });
};

const jsonRequest = function jsonRequest(message: WebhookMessage): WebhookRequest {
    return { body: payloadOf(message), headers: { [CONTENT_TYPE]: JSON_TYPE }, method: METHOD };
};

const formRequest = function formRequest(message: WebhookMessage, attachment: Attachment): WebhookRequest {
    const form = new FormData();
    form.append(PAYLOAD_FIELD, payloadOf(message));
    form.append(ATTACHMENT_FIELD, new File([attachment.content], attachment.name, { type: ATTACHMENT_TYPE }));
    return { body: form, method: METHOD };
};

export const postWebhook = async function postWebhook(url: string, message: WebhookMessage): Promise<void> {
    const request = message.attachment === null ? jsonRequest(message) : formRequest(message, message.attachment);
    const response = await fetch(url, request);
    if (!response.ok) {
        throw new Error(`${String(response.status)} ${response.statusText}`);
    }
};
