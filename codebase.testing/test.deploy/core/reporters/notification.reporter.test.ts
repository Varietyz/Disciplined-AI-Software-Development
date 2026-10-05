import {
    DURATION_FIELD,
    FAILED_AT_FIELD,
    FINISHED_FIELD,
} from "@banes-lab/deploy/configuration/strings/notification.strings.ts";
import { NOTIFIED, NOTIFY_FAILED } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { embed, field, notify, timing } from "@banes-lab/deploy/core/reporters/notification.reporter.ts";
import type { EmbedField } from "@banes-lab/deploy/types/discord.types.ts";
import type { Span } from "@banes-lab/deploy/types/deployment.types.ts";
import { THUMBNAIL_URL } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { fakeJournal } from "../steps/shell.fixture.ts";
import { stubFetch } from "./webhook.fixture.ts";

const SPAN: Span = { finishedAt: 3000, startedAt: 1000 };
const URL = "https://hooks.example.test/1";

describe("field", () => {
    it("defaults to a block field", () => {
        const value: EmbedField = field("n", "v");
        expect(value).toStrictEqual({ inline: false, name: "n", value: "v" });
    });
});

describe("timing", () => {
    it("labels the second field as finished on success", () => {
        const [duration, finished] = timing(SPAN, true);
        expect(duration?.name).toBe(DURATION_FIELD);
        expect(finished?.name).toBe(FINISHED_FIELD);
    });

    it("labels the second field as failed at on failure", () => {
        const [, failed] = timing(SPAN, false);
        expect(failed?.name).toBe(FAILED_AT_FIELD);
    });
});

describe("embed", () => {
    it("carries the thumbnail and a timestamp", () => {
        const value = embed("title", 1, []);
        expect(value.thumbnail.url).toBe(THUMBNAIL_URL);
        expect(value.timestamp.length).toBeGreaterThan(0);
    });
});

describe("notify", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("logs success after posting and answers that the report was delivered", async () => {
        stubFetch();
        const journal = fakeJournal();
        await expect(notify(journal, URL, "", embed("t", 0, []))).resolves.toBe(true);
        expect(journal.lines).toContain(NOTIFIED);
    });

    it("logs a failed post as an error and answers that the report was not delivered", async () => {
        stubFetch().mockRejectedValue(new Error("offline"));
        const journal = fakeJournal();
        await expect(notify(journal, URL, "", embed("t", 0, []))).resolves.toBe(false);
        expect(journal.lines).toContain(`${NOTIFY_FAILED}offline`);
    });
});
