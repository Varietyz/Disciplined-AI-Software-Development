import { describe, expect, it } from "vitest";
import { shellFor } from "@govlab/pipeline/core/resolvers/shell.resolver.ts";

const WINDOWS = "win32";
const CUSTOM_PROCESSOR = "C:/Windows/System32/cmd.exe";

describe("shellFor", () => {
    it("uses the host command processor on Windows when one is declared", () => {
        expect(shellFor(WINDOWS, CUSTOM_PROCESSOR)).toStrictEqual({ flag: "/d /s /c", shell: CUSTOM_PROCESSOR });
    });

    it("falls back to the conventional processor on Windows when none is declared", () => {
        expect(shellFor(WINDOWS).shell).toBe("cmd.exe");
    });

    it("uses a posix shell on every other platform and ignores any command processor", () => {
        for (const platform of ["linux", "darwin", "freebsd"]) {
            expect(shellFor(platform, CUSTOM_PROCESSOR)).toStrictEqual({ flag: "-c", shell: "/bin/sh" });
        }
    });
});
