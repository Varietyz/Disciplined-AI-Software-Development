import { afterEach, describe, expect, it, vi } from "vitest";
import { conclude, say } from "@banes-lab/social-share/core/reporters/card.reporter.ts";
import process from "node:process";

describe("say and conclude", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        process.exitCode = 0;
    });

    it("prints the clean line and passes when nothing was found", () => {
        const out = vi.spyOn(process.stdout, "write").mockReturnValue(true);
        say("hello");
        expect(conclude([], "clean")).toBe(true);
        expect(out.mock.calls.map(([text]) => text)).toStrictEqual(["hello\n", "clean\n"]);
    });

    it("prints every finding and fails the process", () => {
        const errors = vi.spyOn(process.stderr, "write").mockReturnValue(true);
        expect(conclude([{ card: "demo", message: "is broken." }], "clean")).toBe(false);
        expect(errors.mock.calls[0]?.[0]).toBe("  demo is broken.\n");
        expect(process.exitCode).toBe(1);
    });
});
