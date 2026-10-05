import { describe, expect, it } from "vitest";
import { TAXONOMY } from "../loaders/stats.fixture.ts";
import { taxonomySection } from "@govlab/stats/core/reporters/taxonomy.reporter.ts";

describe("taxonomySection", () => {
    it("renders coverage, conformance, vocabulary, layers, depth and containers", () => {
        const text = taxonomySection(TAXONOMY).join("\n");
        for (const heading of [
            "Taxonomy coverage",
            "Taxonomy conformance",
            "Taxonomy vocabulary",
            "Layer spine",
            "Depth distribution",
            "Containers",
        ]) {
            expect(text).toContain(`### ${heading}`);
        }
    });
});
