export interface EmbedField {
    readonly inline: boolean;
    readonly name: string;
    readonly value: string;
}

export interface Embed {
    readonly color: number;
    readonly fields: readonly EmbedField[];
    readonly thumbnail: { readonly url: string };
    readonly timestamp: string;
    readonly title: string;
}

export interface Attachment {
    readonly content: string;
    readonly name: string;
}

export interface WebhookMessage {
    readonly attachment: Attachment | null;
    readonly content: string;
    readonly embed: Embed;
}

export type WebhookRequest = NonNullable<Parameters<typeof fetch>[1]>;
