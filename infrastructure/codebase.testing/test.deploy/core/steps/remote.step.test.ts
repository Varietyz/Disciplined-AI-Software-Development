import { ROOT_CLEAN, STALE_REMOVED } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { describe, expect, it } from "vitest";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";
import { REMOTE_ROOT } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { pruneRemoteRoot } from "@banes-lab/deploy/core/steps/remote.step.ts";

const LEGACY = `${REMOTE_ROOT}/node_modules`;
const ECOSYSTEM = `${REMOTE_ROOT}/ecosystem.config.cjs`;

describe("pruneRemoteRoot", () => {
    it("lists the root without the owned folders and leaves a clean root alone", async () => {
        const shell = fakeShell(() => ok(""));
        const journal = fakeJournal();
        expect(await pruneRemoteRoot(shell, journal)).toStrictEqual([]);
        expect(shell.commands[0]).toContain(`find ${REMOTE_ROOT} -mindepth 1 -maxdepth 1 ! -name web ! -name staging`);
        expect(journal.lines).toContain(ROOT_CLEAN);
    });

    it("removes every stale entry with file operations only, never touching a process manager", async () => {
        const shell = fakeShell((command) => ok(command.startsWith("find") ? `${LEGACY}\n${ECOSYSTEM}\n` : ""));
        const journal = fakeJournal();
        expect(await pruneRemoteRoot(shell, journal)).toStrictEqual([LEGACY, ECOSYSTEM]);
        expect(shell.commands).toStrictEqual([shell.commands[0], `rm -rf ${LEGACY} ${ECOSYSTEM}`]);
        expect(shell.commands.some((command) => command.includes("pm2"))).toBe(false);
        expect(journal.lines).toContain(STALE_REMOVED + LEGACY);
    });
});
