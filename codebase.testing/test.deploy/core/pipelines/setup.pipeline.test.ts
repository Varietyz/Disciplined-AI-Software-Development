import type { SetupContext, SetupEffect } from "@banes-lab/deploy/types/deployment.types.ts";
import { checked, runEffects, stagedOf } from "@banes-lab/deploy/core/pipelines/setup.pipeline.ts";
import { describe, expect, it } from "vitest";
import { fakeJournal, fakeShell, ok } from "../steps/shell.fixture.ts";

const fetchIndex = async (): Promise<string> => {
    await Promise.resolve();
    return "";
};

const CONTEXT: SetupContext = {
    fetchIndex,
    journal: fakeJournal(),
    modules: [],
    plan: { added: [], install: [], revert: [] },
    shell: fakeShell(() => ok()),
};

describe("runEffects", () => {
    it("runs the effects that apply, in their declared order, and skips the rest", async () => {
        const ran: string[] = [];
        const effect = (label: string, applies: boolean): SetupEffect => ({
            applies: () => applies,
            run: async () => {
                await Promise.resolve();
                ran.push(label);
            },
        });
        await runEffects([effect("first", true), effect("skipped", false), effect("last", true)], CONTEXT);
        expect(ran).toStrictEqual(["first", "last"]);
    });
});

describe("checked and stagedOf", () => {
    it("returns a command's output, fails with its error, and stages each package by its file name", async () => {
        expect(
            await checked(
                fakeShell(() => ok("done")),
                "true",
                "failed: ",
            ),
        ).toBe("done");
        const failing = fakeShell(() => ({ code: 1, stderr: "denied", stdout: "" }));
        await expect(checked(failing, "false", "failed: ")).rejects.toThrow("failed: denied");
        const stanza = {
            depends: [],
            name: "a",
            provides: [],
            sha256: "",
            url: "https://x.test/pool/a_1_amd64.deb",
            version: "1",
        };
        expect(stagedOf([stanza]).at(0)).toMatch("/a_1_amd64.deb");
    });
});
