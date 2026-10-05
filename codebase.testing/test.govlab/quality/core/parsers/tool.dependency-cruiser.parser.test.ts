import { describe, expect, it } from "vitest";
import { parseDependencyCruiserOutput } from "@govlab/quality/core/parsers/tool.dependency-cruiser.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    summary: {
        violations: [
            { from: "src/a.js", rule: { name: "no-circular", severity: "error" }, to: "src/b.js", type: "cycle" },
            {
                from: "src/x.js",
                rule: { name: "no-secret", severity: "error" },
                to: "src/secret.js",
                type: "dependency",
            },
        ],
    },
});

describe("parseDependencyCruiserOutput", () => {
    it("maps each violation to an advisory (advisory:true) error finding keyed by the rule name", () => {
        const findings = parseDependencyCruiserOutput(RECORDED, "javascript");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: true,
            ecosystem: "javascript",
            file: "src/a.js",
            ruleId: "no-circular",
            severity: "error",
            tool: "dependency-cruiser",
        });
        expect(findings[0]?.message).toContain("src/a.js → src/b.js");
        expect(findings[1]).toMatchObject({ file: "src/x.js", ruleId: "no-secret" });
    });

    it("returns [] when there are no violations or the output is non-JSON", () => {
        expect(parseDependencyCruiserOutput("", "javascript")).toEqual([]);
        expect(parseDependencyCruiserOutput(JSON.stringify({ summary: { violations: [] } }), "javascript")).toEqual([]);
        expect(parseDependencyCruiserOutput("not json", "javascript")).toEqual([]);
    });
});
