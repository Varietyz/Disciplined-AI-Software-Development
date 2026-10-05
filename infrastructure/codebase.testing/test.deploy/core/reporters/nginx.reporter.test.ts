import {
    PULL_FAILURE_TITLE,
    PULL_SUCCESS_TITLE,
    PUSH_FAILURE_TITLE,
    PUSH_SUCCESS_TITLE,
} from "@banes-lab/deploy/configuration/strings/notification.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    reportPull,
    reportPullFailure,
    reportPush,
    reportPushFailure,
} from "@banes-lab/deploy/core/reporters/nginx.reporter.ts";
import { stubFetch, titleOf } from "./webhook.fixture.ts";
import type { Span } from "@banes-lab/deploy/types/deployment.types.ts";
import { fakeJournal } from "../steps/shell.fixture.ts";
import { localSiteConfig } from "@banes-lab/deploy/core/steps/nginx.step.ts";

const SPAN: Span = { finishedAt: 2, startedAt: 1 };
const URL = "https://hooks.example.test/1";

describe("nginx reporter", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("reportPull posts the pull success title", async () => {
        const fetchMock = stubFetch();
        await reportPull(fakeJournal(), URL, SPAN, "local.conf");
        expect(titleOf(fetchMock)).toBe(PULL_SUCCESS_TITLE);
    });

    it("reportPullFailure posts the pull failure title", async () => {
        const fetchMock = stubFetch();
        await reportPullFailure(fakeJournal(), URL, SPAN, "boom");
        expect(titleOf(fetchMock)).toBe(PULL_FAILURE_TITLE);
    });

    it("reportPush attaches the local config and posts the push success title", async () => {
        const fetchMock = stubFetch();
        await reportPush(fakeJournal(), URL, SPAN, "remote-backup", localSiteConfig());
        expect(titleOf(fetchMock)).toBe(PUSH_SUCCESS_TITLE);
    });

    it("reportPushFailure posts the push failure title", async () => {
        const fetchMock = stubFetch();
        await reportPushFailure(fakeJournal(), URL, SPAN, "", "boom");
        expect(titleOf(fetchMock)).toBe(PUSH_FAILURE_TITLE);
    });
});
