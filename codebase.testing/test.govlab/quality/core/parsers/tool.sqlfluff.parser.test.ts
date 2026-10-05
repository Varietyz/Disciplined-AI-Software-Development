import { describe, expect, it } from "vitest";
import { parseSqlfluffOutput } from "@govlab/quality/core/parsers/tool.sqlfluff.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify([
    {
        filepath: "q.sql",
        violations: [
            {
                code: "LT01",
                description: "Expected single whitespace between comma ',' and naked identifier.",
                fixes: [{ edit: " ", type: "create_after" }],
                name: "layout.spacing",
                start_line_no: 1,
                start_line_pos: 10,
                warning: false,
            },
            {
                code: "LT09",
                description: "Select targets should be on a new line unless there is only one select target.",
                fixes: [],
                name: "layout.select_targets",
                start_line_no: 1,
                start_line_pos: 1,
                warning: false,
            },
        ],
    },
]);

describe("parseSqlfluffOutput", () => {
    it("maps violations to gating (error, advisory:false) Findings", () => {
        const findings = parseSqlfluffOutput(RECORDED, "sql");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 10,
            ecosystem: "sql",
            file: "q.sql",
            fixable: true,
            line: 1,
            ruleId: "LT01",
            severity: "error",
            tool: "sqlfluff",
        });
        expect(findings[1]).toMatchObject({ column: 1, fixable: false, ruleId: "LT09" });
    });

    it("returns [] on empty, no-violations, or non-JSON output", () => {
        expect(parseSqlfluffOutput("", "sql")).toEqual([]);
        expect(parseSqlfluffOutput("[]", "sql")).toEqual([]);
        expect(parseSqlfluffOutput("not json", "sql")).toEqual([]);
    });
});
