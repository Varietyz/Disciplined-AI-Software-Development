import { type Mock, vi } from "vitest";
import { PAYLOAD_FIELD } from "@banes-lab/deploy/configuration/constants/discord.constants.ts";
import type { WebhookRequest } from "@banes-lab/deploy/types/discord.types.ts";

export type FetchMock = Mock<typeof fetch>;

export const stubFetch = function stubFetch(status = 204, statusText = ""): FetchMock {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status, statusText }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
};

export const requestOf = function requestOf(fetchMock: FetchMock): WebhookRequest {
    const [, request] = fetchMock.mock.calls[0] ?? [];
    return request ?? {};
};

const rawPayloadOf = function rawPayloadOf(request: WebhookRequest): string {
    const { body } = request;
    if (typeof body === "string") {
        return body;
    }
    if (body instanceof FormData) {
        const entry = body.get(PAYLOAD_FIELD);
        return typeof entry === "string" ? entry : "";
    }
    return "";
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const titleIn = function titleIn(payload: unknown): string {
    if (!isRecord(payload)) {
        return "";
    }
    const { embeds } = payload;
    if (!Array.isArray(embeds)) {
        return "";
    }
    const entries: unknown[] = embeds;
    const [first] = entries;
    return isRecord(first) && typeof first["title"] === "string" ? first["title"] : "";
};

export const titleOf = function titleOf(fetchMock: FetchMock): string {
    const parsed: unknown = JSON.parse(rawPayloadOf(requestOf(fetchMock)));
    return titleIn(parsed);
};
