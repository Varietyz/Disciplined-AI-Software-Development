import {
    buildAnalysis,
    buildFindings,
    buildMasterFindings,
} from "@govlab/patterns/core/formatters/report.formatter.ts";
import { describe, expect, it } from "vitest";
import { isRecord } from "@govlab/patterns/core/predicates/record.predicate.ts";

const keysOf = function keysOf(json: string): string[] {
    const parsed: unknown = JSON.parse(json);
    return isRecord(parsed) ? Object.keys(parsed) : [];
};

const finding = {
    confidence: "high",
    detail: "d",
    file: "a.ts",
    kind: "dead-code",
    line: 1,
    members: [],
    name: "orphan",
    relevance: 1,
    remedy: "r",
    severity: "medium",
};

describe("the report formatter", () => {
    it("writes a module's findings with a summary by kind", () => {
        const json = buildFindings("mod", [finding]);
        expect(keysOf(json)).toStrictEqual(["module", "summary", "findings"]);
        expect(json).toContain('"byKind":{"dead-code":1}');
    });

    it("writes the master findings across modules, skipping clean modules in the per-module rows", () => {
        const json = buildMasterFindings([
            { findings: [finding], module: "b" },
            { findings: [], module: "a" },
        ]);
        expect(keysOf(json)).toStrictEqual(["summary", "modules", "findings"]);
        expect(json).toContain('"modules":2');
        expect(json).not.toContain('"module":"a","total"');
    });

    it("writes the analysis with its unresolved calls, definitions and edges", () => {
        const json = buildAnalysis({
            findingsCount: 0,
            graph: { edges: [], external: [] },
            insight: { definitions: 0, edges: 0, invariants: [], symbols: [], variants: [] },
            title: "mod",
        });
        expect(keysOf(json)).toStrictEqual(["module", "summary", "unresolvedCalls", "definitions", "edges"]);
    });
});
