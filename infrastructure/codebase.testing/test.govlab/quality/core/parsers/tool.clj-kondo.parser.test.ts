import { describe, expect, it } from "vitest";
import { parseCljKondoOutput } from "@govlab/quality/core/parsers/tool.clj-kondo.parser.ts";

const EXPECTED_COUNT = 2;

const RECORDED = JSON.stringify({
    findings: [
        {
            col: 16,
            filename: "govlab-governance/polyglot/clojure/bad.clj",
            level: "warning",
            message: "unused binding x",
            row: 3,
            type: "unused-binding",
        },
        {
            col: 1,
            filename: "govlab-governance/polyglot/clojure/bad.clj",
            level: "error",
            message: "redefined var #'bad/dup",
            row: 7,
            type: "redefined-var",
        },
    ],
    summary: { error: 1, warning: 1 },
});

describe("parseCljKondoOutput", () => {
    it("maps each finding to a gating (advisory:false) finding keyed by its type, level→severity", () => {
        const findings = parseCljKondoOutput(RECORDED, "clojure");
        expect(findings).toHaveLength(EXPECTED_COUNT);
        expect(findings[0]).toMatchObject({
            advisory: false,
            column: 16,
            ecosystem: "clojure",
            file: "govlab-governance/polyglot/clojure/bad.clj",
            line: 3,
            ruleId: "unused-binding",
            severity: "error",
            tool: "clj-kondo",
        });
        expect(findings[1]).toMatchObject({ advisory: false, line: 7, ruleId: "redefined-var", severity: "error" });
    });

    it("returns [] on empty, no-findings, or non-JSON output", () => {
        expect(parseCljKondoOutput("", "clojure")).toEqual([]);
        expect(parseCljKondoOutput(JSON.stringify({ findings: [] }), "clojure")).toEqual([]);
        expect(parseCljKondoOutput("not json", "clojure")).toEqual([]);
    });
});
