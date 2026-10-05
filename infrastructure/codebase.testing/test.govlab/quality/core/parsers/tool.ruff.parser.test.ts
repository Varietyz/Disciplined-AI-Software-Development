import { describe, expect, it } from "vitest";
import { parseRuffOutput } from "@govlab/quality/core/parsers/tool.ruff.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify([
    {
        code: "F401",
        filename: "/proj/app.py",
        fix: { applicability: "safe", message: "Remove unused import: `os`" },
        location: { column: 8, row: 1 },
        message: "`os` imported but unused",
    },
    {
        code: "PLR0913",
        filename: "/proj/app.py",
        fix: null,
        location: { column: 5, row: 10 },
        message: "Too many arguments in function definition (7 > 4)",
    },
]);

describe("parseRuffOutput", () => {
    it("maps ruff JSON diagnostics to advisory:false Findings", () => {
        const findings = parseRuffOutput(RECORDED, "python");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 8,
            ecosystem: "python",
            file: "/proj/app.py",
            fixable: true,
            line: 1,
            ruleId: "F401",
            severity: "error",
            tool: "ruff",
        });
        expect(findings[1]).toMatchObject({ advisory: false, column: 5, fixable: false, line: 10, ruleId: "PLR0913" });
    });

    it("returns [] on empty, empty-array, or non-JSON output", () => {
        expect(parseRuffOutput("", "python")).toEqual([]);
        expect(parseRuffOutput("[]", "python")).toEqual([]);
        expect(parseRuffOutput("not json", "python")).toEqual([]);
    });
});
