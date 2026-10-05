import {
    ATTACHMENT_FIELD,
    FIELD_VALUE_LIMIT,
    PAYLOAD_FIELD,
} from "@banes-lab/deploy/configuration/constants/discord.constants.ts";
import {
    DEPLOY_FAILURE_TITLE,
    DEPLOY_SUCCESS_TITLE,
    ERROR_FIELD,
    FAILURE_ATTACHED,
} from "@banes-lab/deploy/configuration/strings/notification.strings.ts";
import type { Outcome, UploadStats } from "@banes-lab/deploy/types/deployment.types.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requestOf, stubFetch, titleOf } from "./webhook.fixture.ts";
import { fakeJournal } from "../steps/shell.fixture.ts";
import { reportDeployment } from "@banes-lab/deploy/core/reporters/deployment.reporter.ts";

vi.mock("@banes-lab/deploy/core/probes/vcs.probe.ts", () => ({ describeCheckout: () => "checkout" }));

const STATS: UploadStats = { failedCount: 0, totalBytes: 10, totalFileCount: 2, uploadedCount: 2 };

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const errorFieldOf = function errorFieldOf(payload: string): string {
    const parsed: unknown = JSON.parse(payload);
    const embeds = isRecord(parsed) ? parsed["embeds"] : null;
    const list: readonly unknown[] = Array.isArray(embeds) ? embeds : [];
    const [first] = list;
    const fields = isRecord(first) ? first["fields"] : null;
    const found: unknown = Array.isArray(fields)
        ? fields.find((entry: unknown) => isRecord(entry) && entry["name"] === ERROR_FIELD)
        : null;
    return isRecord(found) && typeof found["value"] === "string" ? found["value"] : "";
};
const URL = "https://hooks.example.test/1";

describe("reportDeployment", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("posts the success embed when there is no failure", async () => {
        const fetchMock = stubFetch();
        const outcome: Outcome = {
            backup: "b.tar.gz",
            failure: "",
            span: { finishedAt: 2, startedAt: 1 },
            stats: STATS,
        };
        await reportDeployment(fakeJournal(), URL, outcome);
        expect(titleOf(fetchMock)).toBe(DEPLOY_SUCCESS_TITLE);
    });

    it("keeps a long failure inside the field limit and attaches the whole report", async () => {
        const fetchMock = stubFetch();
        const failure = Array.from({ length: 200 }, (_, index) => `finding ${String(index)} names a file`).join("\n");
        const outcome: Outcome = { backup: "", failure, span: { finishedAt: 2, startedAt: 1 }, stats: null };
        await reportDeployment(fakeJournal(), URL, outcome);
        const { body } = requestOf(fetchMock);
        expect(body).toBeInstanceOf(FormData);
        const form = body instanceof FormData ? body : new FormData();
        const attached = form.get(ATTACHMENT_FIELD);
        expect(attached instanceof File ? await attached.text() : "").toBe(failure);
        const entry = form.get(PAYLOAD_FIELD);
        const payload = typeof entry === "string" ? entry : "";
        const errorValue = errorFieldOf(payload);
        expect(errorValue.length).toBeLessThanOrEqual(FIELD_VALUE_LIMIT);
        expect(errorValue.endsWith(FAILURE_ATTACHED)).toBe(true);
    });

    it("posts the failure embed when the outcome carries a failure", async () => {
        const fetchMock = stubFetch();
        const outcome: Outcome = { backup: "", failure: "boom", span: { finishedAt: 2, startedAt: 1 }, stats: null };
        await reportDeployment(fakeJournal(), URL, outcome);
        expect(titleOf(fetchMock)).toBe(DEPLOY_FAILURE_TITLE);
    });
});
