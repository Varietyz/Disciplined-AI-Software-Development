import {
    DURATION_FIELD,
    ERROR_FIELD,
    FAILED_AT_FIELD,
    FAILURE_ATTACHED,
    FINISHED_FIELD,
} from "@banes-lab/deploy/configuration/strings/notification.strings.ts";
import {
    FAILURE_ATTACHMENT,
    FIELD_VALUE_LIMIT,
} from "@banes-lab/deploy/configuration/constants/discord.constants.ts";
import { NOTIFIED, NOTIFY_FAILED } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    embed,
    failureAttachment,
    failureField,
    field,
    notify,
    timing,
} from "@banes-lab/deploy/core/reporters/notification.reporter.ts";
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

describe("failureField and failureAttachment", () => {
    it("shows a short failure whole, and cuts a long one at a line inside the field limit with the full text attached", () => {
        expect(failureField("short").value).toContain("short");
        expect(failureAttachment("short")).toBeNull();
        const long = Array.from({ length: 200 }, (_unused, at) => `line ${String(at)} of the failure`).join("\n");
        const shown = failureField(long);
        expect(shown.name).toBe(ERROR_FIELD);
        expect(shown.value.length).toBeLessThanOrEqual(FIELD_VALUE_LIMIT);
        expect(shown.value).toContain(FAILURE_ATTACHED);
        expect(failureAttachment(long)).toStrictEqual({ content: long, name: FAILURE_ATTACHMENT });
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
