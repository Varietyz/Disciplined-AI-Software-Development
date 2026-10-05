import { ATTACHMENT_FIELD, PAYLOAD_FIELD } from "@banes-lab/deploy/configuration/constants/discord.constants.ts";
import type { Embed, WebhookMessage } from "@banes-lab/deploy/types/discord.types.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requestOf, stubFetch } from "../reporters/webhook.fixture.ts";
import { postWebhook } from "@banes-lab/deploy/core/adapters/webhook.adapter.ts";

const EMBED: Embed = { color: 0, fields: [], thumbnail: { url: "" }, timestamp: "", title: "t" };
const URL = "https://hooks.example.test/1";

describe("postWebhook", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("posts json when the message carries no attachment", async () => {
        const fetchMock = stubFetch();
        const message: WebhookMessage = { attachment: null, content: "hi", embed: EMBED };
        await postWebhook(URL, message);
        const request = requestOf(fetchMock);
        expect(request.method).toBe("POST");
        expect(request.body).toContain("hi");
    });

    it("posts multipart form data when the message carries an attachment", async () => {
        const fetchMock = stubFetch();
        const message: WebhookMessage = { attachment: { content: "conf", name: "a.conf" }, content: "", embed: EMBED };
        await postWebhook(URL, message);
        const { body } = requestOf(fetchMock);
        expect(body).toBeInstanceOf(FormData);
        const fields = body instanceof FormData ? [...body.keys()] : [];
        expect(fields).toContain(PAYLOAD_FIELD);
        expect(fields).toContain(ATTACHMENT_FIELD);
    });

    it("throws on a non-ok response", async () => {
        stubFetch(500, "Nope");
        const message: WebhookMessage = { attachment: null, content: "", embed: EMBED };
        await expect(postWebhook(URL, message)).rejects.toThrow("500 Nope");
    });
});
