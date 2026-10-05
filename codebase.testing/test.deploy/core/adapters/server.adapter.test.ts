import { describe, expect, it } from "vitest";
import { fakeShell, ok } from "../steps/shell.fixture.ts";
import { logSize, loggedSince } from "@banes-lab/deploy/core/adapters/server.adapter.ts";
import { LOG_SIZE_COMMAND } from "@banes-lab/deploy/configuration/constants/nginx.constants.ts";
import { PROBE_LOG_UNREADABLE } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";

const LOG = "/var/log/site.log";

describe("logSize", () => {
    it("reads the byte size of the log, and refuses an answer that is not a size", async () => {
        expect(
            await logSize(
                fakeShell(() => ok("42\n")),
                LOG,
            ),
        ).toBe(42);
        await expect(
            logSize(
                fakeShell(() => ok("no such file")),
                LOG,
            ),
        ).rejects.toThrow(PROBE_LOG_UNREADABLE + LOG);
    });
});

describe("loggedSince", () => {
    it("returns nothing when the log did not grow, without reading it", async () => {
        const shell = fakeShell(() => ok("42"));
        expect(await loggedSince(shell, LOG, 42)).toBe("");
        expect(shell.commands).toStrictEqual([`${LOG_SIZE_COMMAND} ${LOG}`]);
    });

    it("reads the bytes written after the offset", async () => {
        const shell = fakeShell((command) => ok(command.startsWith(LOG_SIZE_COMMAND) ? "50" : "line\n"));
        expect(await loggedSince(shell, LOG, 42)).toBe("line");
        expect(shell.commands.at(-1)).toBe(`sudo tail -c +43 ${LOG}`);
    });

    it("reads the whole log when it shrank, because it was rotated", async () => {
        const shell = fakeShell((command) => ok(command.startsWith(LOG_SIZE_COMMAND) ? "10" : "fresh"));
        expect(await loggedSince(shell, LOG, 42)).toBe("fresh");
        expect(shell.commands.at(-1)).toBe(`sudo tail -c +1 ${LOG}`);
    });
});
