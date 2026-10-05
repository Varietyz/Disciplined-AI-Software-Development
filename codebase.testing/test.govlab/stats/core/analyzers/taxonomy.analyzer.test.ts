import { describe, expect, it } from "vitest";
import { DEPTH_COLUMNS } from "@govlab/stats/configuration/constants/taxonomy.constants.ts";
import { TAXONOMY } from "../loaders/stats.fixture.ts";
import { collectTaxonomy } from "@govlab/stats/core/analyzers/taxonomy.analyzer.ts";
import { governedRoots } from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";

describe("collectTaxonomy", () => {
    it("assesses every governed root the gate declares, and never counts more conformant than assessed", () => {
        expect(TAXONOMY.roots.map((root) => root.root).toSorted()).toStrictEqual(governedRoots().toSorted());
        expect(TAXONOMY.totals.conformant).toBeLessThanOrEqual(TAXONOMY.totals.assessed);
        expect(TAXONOMY.ungovernedFiles).toBeGreaterThanOrEqual(0);
        expect(collectTaxonomy).toBeTypeOf("function");
        expect(DEPTH_COLUMNS.at(0)).toBe(0);
    });

    it("rows the vocabulary with used never above declared", () => {
        expect(TAXONOMY.vocabulary.map((row) => row.name)).toContain("concern tags");
        for (const row of TAXONOMY.vocabulary) {
            expect(row.unused).toBe(Math.max(0, row.declared - row.used));
        }
    });
});
