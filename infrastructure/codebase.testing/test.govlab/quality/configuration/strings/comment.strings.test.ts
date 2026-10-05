import {
    cleanedLine,
    commentFailure,
    extractSummary,
    extractedLine,
    modeLine,
    skippedLine,
    stripSummary,
} from "@govlab/quality/configuration/strings/comment.strings.ts";
import { describe, expect, it } from "vitest";

const CLEANED = 3;
const SCANNED = 40;
const ADDED = 2;

describe("comment strings", () => {
    it("name the file, the mode and the reason each line reports", () => {
        expect(skippedLine("a.ts", "too large")).toContain("too large");
        expect(cleanedLine("a.ts")).toContain("a.ts");
        expect(extractedLine("b.ts")).toContain("b.ts");
        expect(modeLine("strip", "src")).toContain("'strip'");
        expect(commentFailure("parse error")).toContain("parse error");
    });

    it("carry the counts in the run summaries", () => {
        expect(stripSummary(CLEANED, SCANNED)).toContain("3 of 40");
        expect(extractSummary(ADDED, "out.json")).toContain("2 new comment(s) to out.json");
    });
});
