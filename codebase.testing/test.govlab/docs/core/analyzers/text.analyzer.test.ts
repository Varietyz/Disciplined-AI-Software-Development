import { describe, expect, it } from "vitest";
import { hardcodedCounts } from "@govlab/docs/core/analyzers/text.analyzer.ts";

describe("hardcodedCounts", () => {
    it("finds each thousands-separated count once and ignores short numbers", () => {
        expect(hardcodedCounts("It holds 1,284 rules and 12,000 files, 1,284 again, and 42 more.")).toStrictEqual([
            "1,284",
            "12,000",
        ]);
        expect(hardcodedCounts("1,28 is not a count")).toStrictEqual([]);
    });
});
