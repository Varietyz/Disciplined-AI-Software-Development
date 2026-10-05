import { describe, expect, it } from "vitest";
import { parseCredoOutput } from "@govlab/quality/core/parsers/tool.credo.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = `Compiling 1 file (.ex)
Generated bad app
{
  "issues": [
    {
      "category": "readability",
      "check": "Credo.Check.Readability.ModuleDoc",
      "column": 11,
      "column_end": 14,
      "filename": "lib/bad.ex",
      "line_no": 1,
      "message": "Modules should have a @moduledoc tag.",
      "priority": 1,
      "scope": "Bad"
    },
    {
      "category": "warning",
      "check": "Credo.Check.Warning.UnusedEnumOperation",
      "column": 5,
      "filename": "lib/bad.ex",
      "line_no": 3,
      "message": "There should be no unused return values."
    }
  ]
}`;

describe("parseCredoOutput", () => {
    it("extracts the JSON object from noisy stdout and maps issues to advisory findings keyed by check", () => {
        const findings = parseCredoOutput(RECORDED, "elixir");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            column: 11,
            ecosystem: "elixir",
            file: "lib/bad.ex",
            line: 1,
            message: "Modules should have a @moduledoc tag.",
            ruleId: "Credo.Check.Readability.ModuleDoc",
            severity: "error",
            tool: "credo",
        });
        expect(findings[1]).toMatchObject({
            advisory: true,
            line: 3,
            ruleId: "Credo.Check.Warning.UnusedEnumOperation",
            severity: "error",
        });
    });

    it("returns [] when there is no JSON object or on malformed JSON", () => {
        expect(parseCredoOutput("", "elixir")).toEqual([]);
        expect(parseCredoOutput("Compiling... no json here", "elixir")).toEqual([]);
        expect(parseCredoOutput("{ not valid json", "elixir")).toEqual([]);
    });
});
