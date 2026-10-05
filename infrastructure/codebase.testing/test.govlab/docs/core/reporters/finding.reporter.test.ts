import { afterEach, describe, expect, it, vi } from "vitest";
import { captureOutput } from "../coordinators/output.fixture.ts";
import { emitFindings } from "@govlab/docs/core/reporters/finding.reporter.ts";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("emitFindings", () => {
    it("writes one line per finding to standard error", () => {
        const output = captureOutput();
        emitFindings("a.md", { spine: [{ detail: "no title", line: 1 }] });
        expect(output.err).toStrictEqual(["✖ a.md:1:1 [spine] no title\n"]);
    });
});
