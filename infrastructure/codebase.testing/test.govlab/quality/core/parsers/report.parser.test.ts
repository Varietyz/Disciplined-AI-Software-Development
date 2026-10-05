import { describe, expect, it } from "vitest";
import { parseSarifReport } from "@govlab/quality/core/parsers/report.parser.ts";

const EXPECTED_COUNT = 2;

const sarifOf = function sarifOf(uri: string, ruleId: string, line: number, column: number): string {
    return JSON.stringify({
        runs: [
            {
                results: [
                    {
                        level: "warning",
                        locations: [
                            {
                                physicalLocation: {
                                    artifactLocation: { uri },
                                    region: { startColumn: column, startLine: line },
                                },
                            },
                        ],
                        message: { text: "A rule reported a defect." },
                        ruleId,
                    },
                ],
            },
        ],
    });
};

const TWO_RESULTS = JSON.stringify({
    runs: [
        {
            results: [
                {
                    locations: [
                        {
                            physicalLocation: {
                                artifactLocation: { uri: "Bad.java" },
                                region: { startColumn: 1, startLine: 1 },
                            },
                        },
                    ],
                    message: { text: "Missing a Javadoc comment." },
                    ruleId: "javadoc.missing",
                },
                {
                    locations: [
                        {
                            physicalLocation: {
                                artifactLocation: { uri: "Bad.java" },
                                region: { startColumn: 10, startLine: 3 },
                            },
                        },
                    ],
                    message: { text: "'=' is not followed by whitespace." },
                    ruleId: "ws.notFollowed",
                },
            ],
        },
    ],
});

describe("parseSarifReport", () => {
    it("maps SARIF results to gating findings keyed to the named tool", () => {
        const findings = parseSarifReport(TWO_RESULTS, "java", "checkstyle");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => !finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            column: 1,
            ecosystem: "java",
            file: "Bad.java",
            line: 1,
            ruleId: "javadoc.missing",
            severity: "error",
            tool: "checkstyle",
        });
        expect(findings[1]).toMatchObject({ column: 10, line: 3, ruleId: "ws.notFollowed" });
    });

    it("strips every file URI scheme to a plain path", () => {
        expect(parseSarifReport(sarifOf("file:/D:/proj/A.java", "x", 1, 1), "java", "pmd")[0]?.file).toBe(
            "D:/proj/A.java",
        );
        expect(parseSarifReport(sarifOf("file:///D:/proj/Bad.kt", "x", 5, 5), "kotlin", "detekt")[0]?.file).toBe(
            "D:/proj/Bad.kt",
        );
    });

    it("returns [] on empty, no-runs, or non-JSON output", () => {
        expect(parseSarifReport("", "java", "pmd")).toEqual([]);
        expect(parseSarifReport(JSON.stringify({ runs: [] }), "java", "pmd")).toEqual([]);
        expect(parseSarifReport("not json", "java", "pmd")).toEqual([]);
    });
});
