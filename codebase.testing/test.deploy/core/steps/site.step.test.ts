import {
    BUILD_FAILED,
    BUILT,
    SITE_INVALID,
    SITE_VALID,
    buildEnded,
} from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { buildSite, validateSite } from "@banes-lab/deploy/core/steps/site.step.ts";
import { describe, expect, it, vi } from "vitest";
import type { ChildExit } from "@banes-lab/deploy/types/deployment.types.ts";
import type { Finding } from "@banes-lab/build-scripts/types/validation.types.ts";
import { absolutePath } from "@ssot/paths";
import { fakeJournal } from "./shell.fixture.ts";

const clean = async function clean(): Promise<Finding[]> {
    await Promise.resolve();
    return [];
};

const broken = async function broken(): Promise<Finding[]> {
    await Promise.resolve();
    return [{ file: "json/api.json", message: "The index is missing." }];
};

describe("buildSite", () => {
    it("builds the web member in its own process and marks the step", async () => {
        const run = vi.fn(async (_member: string): Promise<ChildExit> => {
            await Promise.resolve();
            return { code: 0, signal: null };
        });
        const journal = fakeJournal();
        await buildSite(journal, run);
        expect(journal.lines).toContain(BUILT);
        expect(run).toHaveBeenCalledWith(absolutePath("app.member"));
    });

    it("refuses a build that exits with a code or a signal, and one that cannot start", async () => {
        const exits = async (ended: ChildExit): Promise<void> =>
            buildSite(fakeJournal(), async () => {
                await Promise.resolve();
                return ended;
            });
        await expect(exits({ code: 1, signal: null })).rejects.toThrow(BUILD_FAILED + buildEnded(1, null));
        await expect(exits({ code: null, signal: "SIGKILL" })).rejects.toThrow(BUILD_FAILED + buildEnded(null, "SIGKILL"));
        const unstartable = async (): Promise<ChildExit> => {
            await Promise.resolve();
            throw new Error("spawn");
        };
        await expect(buildSite(fakeJournal(), unstartable)).rejects.toThrow(`${BUILD_FAILED}spawn`);
    });
});

describe("validateSite", () => {
    it("marks a clean build and refuses one with any finding, naming the finding", async () => {
        const journal = fakeJournal();
        await validateSite(journal, clean);
        expect(journal.lines).toContain(SITE_VALID);
        await expect(validateSite(fakeJournal(), broken)).rejects.toThrow(SITE_INVALID);
        await expect(validateSite(fakeJournal(), broken)).rejects.toThrow("json/api.json");
    });
});
