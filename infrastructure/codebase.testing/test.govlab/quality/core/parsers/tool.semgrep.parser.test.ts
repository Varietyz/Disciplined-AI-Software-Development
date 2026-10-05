import { describe, expect, it } from "vitest";
import { parseSemgrepOutput } from "@govlab/quality/core/parsers/tool.semgrep.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    errors: [],
    results: [
        {
            check_id: "govlab-governance.polyglot.semgrep.insecure-random",
            end: { col: 29, line: 5 },
            extra: { message: "Use a cryptographically secure RNG, not System.Random", severity: "WARNING" },
            path: "govlab-governance/polyglot/semgrep/Bad.cs",
            start: { col: 17, line: 5 },
        },
        {
            check_id: "rules.hardcoded-secret",
            extra: { message: "Hardcoded secret", severity: "ERROR" },
            path: "x.cs",
            start: { line: 9 },
        },
    ],
});

describe("parseSemgrepOutput", () => {
    it("maps each result to an advisory (advisory:true) finding keyed by check_id, severity mapped", () => {
        const findings = parseSemgrepOutput(RECORDED, "csharp");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 17,
            ecosystem: "csharp",
            file: "govlab-governance/polyglot/semgrep/Bad.cs",
            line: 5,
            ruleId: "govlab-governance.polyglot.semgrep.insecure-random",
            severity: "error",
            tool: "semgrep",
        });
        expect(findings[1]).toMatchObject({
            advisory: true,
            column: 1,
            line: 9,
            ruleId: "rules.hardcoded-secret",
            severity: "error",
        });
    });

    it("returns [] on empty, no-results, or non-JSON output", () => {
        expect(parseSemgrepOutput("", "csharp")).toEqual([]);
        expect(parseSemgrepOutput(JSON.stringify({ results: [] }), "csharp")).toEqual([]);
        expect(parseSemgrepOutput("not json", "csharp")).toEqual([]);
    });
});
