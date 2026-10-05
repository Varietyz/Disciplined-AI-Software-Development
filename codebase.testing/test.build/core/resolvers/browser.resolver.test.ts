import { browserCandidates, findBrowser } from "@banes-lab/build-scripts/core/resolvers/browser.resolver.ts";
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import process from "node:process";
import { tmpdir } from "node:os";

const MISSING = join(tmpdir(), "no-such-browser-binary");

describe("browserCandidates", () => {
    it("lists absolute binaries only", () => {
        expect(browserCandidates().every((candidate) => candidate.length > 0)).toBe(true);
    });
});

describe("findBrowser", () => {
    it("prefers a configured binary that exists", () => {
        expect(findBrowser(process.execPath)).toBe(process.execPath);
    });

    it("falls through a configured binary that does not exist", () => {
        expect(findBrowser(MISSING)).not.toBe(MISSING);
    });
});
