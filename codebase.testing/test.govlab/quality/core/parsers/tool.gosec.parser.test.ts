import { describe, expect, it } from "vitest";
import { parseGosecOutput } from "@govlab/quality/core/parsers/tool.gosec.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED =
    '{"Issues":[' +
    '{"column":"9","confidence":"HIGH","details":"Subprocess launched with variable","file":"main.go","line":"6","rule_id":"G204","severity":"MEDIUM"},' +
    '{"column":"5","confidence":"LOW","details":"Potential hardcoded credentials","file":"secrets.go","line":"3","rule_id":"G101","severity":"HIGH"}' +
    '],"Stats":{"files":1,"lines":12}}';

const MISSING_POS = '{"Issues":[{"details":"file path from variable","rule_id":"G304","severity":"MEDIUM"}]}';

describe("parseGosecOutput", () => {
    it("maps every issue to an ADVISORY finding (advisory:true, never gates), coercing string line/column", () => {
        const findings = parseGosecOutput(RECORDED, "go");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings.every((finding) => finding.advisory)).toBe(true);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 9,
            ecosystem: "go",
            file: "main.go",
            line: 6,
            ruleId: "G204",
            severity: "error",
            tool: "gosec",
        });
        expect(findings[1]).toMatchObject({ advisory: true, line: 3, ruleId: "G101", severity: "error" });
    });

    it("falls back to POSITION when line/column are missing or non-numeric", () => {
        const findings = parseGosecOutput(MISSING_POS, "go");
        expect(findings[0]).toMatchObject({ column: 1, line: 1, ruleId: "G304" });
    });

    it("returns [] on empty, no-Issues, or non-JSON output", () => {
        expect(parseGosecOutput("", "go")).toEqual([]);
        expect(parseGosecOutput("{}", "go")).toEqual([]);
        expect(parseGosecOutput("not json", "go")).toEqual([]);
    });
});
