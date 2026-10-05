import { describe, expect, it } from "vitest";
import { parseMadgeOutput } from "@govlab/quality/core/parsers/tool.madge.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify([
    ["a.js", "b.js"],
    ["x.js", "y.js", "z.js"],
]);

describe("parseMadgeOutput", () => {
    it("maps each cycle to an advisory (advisory:true) error finding on the first file, closing the loop", () => {
        const findings = parseMadgeOutput(RECORDED, "javascript");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            ecosystem: "javascript",
            file: "a.js",
            ruleId: "circular-dependency",
            severity: "error",
            tool: "madge",
        });
        expect(findings[0]?.message).toContain("a.js → b.js → a.js");
        expect(findings[1]?.message).toContain("x.js → y.js → z.js → x.js");
    });

    it("returns [] on empty, no-cycle, or non-JSON output", () => {
        expect(parseMadgeOutput("", "javascript")).toEqual([]);
        expect(parseMadgeOutput("[]", "javascript")).toEqual([]);
        expect(parseMadgeOutput("not json", "javascript")).toEqual([]);
    });
});
