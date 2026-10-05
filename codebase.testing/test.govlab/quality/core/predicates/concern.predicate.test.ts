import { describe, expect, it } from "vitest";
import type { Indices } from "@govlab/quality/types/quality.types.ts";
import type { QualityConcern } from "@govlab/quality/types/catalog.types.ts";
import { matchesFilter } from "@govlab/quality/core/predicates/concern.predicate.ts";

const LIMIT = 200;

const CONCERN: QualityConcern = {
    id: "file-length",
    name: "file-length",
    numeric: true,
    ruleCount: 2,
    severity: "error",
    toolCount: 2,
    value: LIMIT,
};

const INDICES: Indices = {
    byConceptId: new Map(),
    byConcern: new Map(),
    byRule: new Map(),
    byTool: new Map(),
    concepts: [],
    concernEcosystems: new Map([["file-length", new Set(["typescript"])]]),
    concernTools: new Map([["file-length", new Set(["eslint", "pylint"])]]),
    concerns: [CONCERN],
    rules: [],
    rulesByConcern: new Map(),
    tools: [],
};

describe("matchesFilter", () => {
    it("holds when every filter field the query sets matches the concern", () => {
        expect(matchesFilter(INDICES, CONCERN, {})).toBe(true);
        expect(matchesFilter(INDICES, CONCERN, { crossTool: true, ecosystem: "typescript", tool: "eslint" })).toBe(
            true,
        );
    });

    it("fails on the first field that does not match", () => {
        expect(matchesFilter(INDICES, CONCERN, { tool: "ruff" })).toBe(false);
        expect(matchesFilter(INDICES, CONCERN, { minValue: LIMIT + 1 })).toBe(false);
        expect(matchesFilter(INDICES, CONCERN, { numeric: false })).toBe(false);
    });
});
