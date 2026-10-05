import { NGINX_SOURCE, SOURCE_MODULES } from "@banes-lab/deploy/configuration/constants/nginx.constants.ts";
import {
    builtPath,
    compileModules,
    markerOf,
    restoreModules,
    settleModules,
    staleModules,
    swapModules,
    verifiedFetch,
} from "@banes-lab/deploy/core/steps/build.step.ts";
import { describe, expect, it } from "vitest";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";
import { MODULE_BUILD_FAILED } from "@banes-lab/deploy/configuration/strings/nginx.strings.ts";

const [MODULE] = SOURCE_MODULES;

describe("staleModules", () => {
    it("rebuilds a module whose object or build marker does not match the pinned nginx and module versions", async () => {
        if (MODULE === undefined) {
            return;
        }
        const current = fakeShell(() => ok(`${markerOf(MODULE)}\n`));
        expect(await staleModules(current)).toStrictEqual([]);
        const older = fakeShell(() => ok("1.30.3 0.40"));
        expect(await staleModules(older)).toStrictEqual([MODULE]);
        const missing = fakeShell(() => ({ code: 1, stderr: "", stdout: "" }));
        expect(await staleModules(missing)).toStrictEqual([MODULE]);
        expect(markerOf(MODULE)).toBe(`${NGINX_SOURCE.upstream} ${MODULE.version}`);
    });
});

describe("compileModules", () => {
    it("fetches and verifies every source archive, then builds only the dynamic modules", async () => {
        if (MODULE === undefined) {
            return;
        }
        const shell = fakeShell(() => ok());
        await compileModules(shell, fakeJournal(), [MODULE]);
        const [command = ""] = shell.commands;
        expect(verifiedFetch("https://example.test/a.tar.gz", "/srv/a.tar.gz", "abc")).toBe(
            'curl -fsSL -o /srv/a.tar.gz "https://example.test/a.tar.gz" && echo "abc  /srv/a.tar.gz" | sha256sum -c --quiet -',
        );
        expect(command).toContain(NGINX_SOURCE.sha256);
        expect(command).toContain(MODULE.sha256);
        expect(command).toContain(`--with-compat --add-dynamic-module=../${MODULE.folder}`);
        expect(command).toContain("make modules");
        expect(builtPath(MODULE)).toContain(`${NGINX_SOURCE.folder}/objs/${MODULE.object}`);
    });

    it("fails loudly when a build step fails", async () => {
        const shell = fakeShell(() => ({ code: 2, stderr: "checksum mismatch", stdout: "" }));
        await expect(compileModules(shell, fakeJournal(), SOURCE_MODULES)).rejects.toThrow(MODULE_BUILD_FAILED);
    });
});

describe("swapModules, restoreModules and settleModules", () => {
    it("keeps the previous object while the change is on trial and restores or drops it afterwards", async () => {
        const shell = fakeShell(() => ok());
        await [swapModules, restoreModules, settleModules].reduce(async (previous, step) => {
            await previous;
            await step(shell, SOURCE_MODULES);
        }, Promise.resolve());
        const [swap = "", restore = "", settle = ""] = shell.commands;
        expect(swap).toContain(".previous");
        expect(swap).toContain("sudo install -m 644");
        expect(restore).toContain("sudo mv");
        expect(restore).toContain("else sudo rm -f");
        expect(settle).toContain("sudo rm -f");
    });
});
