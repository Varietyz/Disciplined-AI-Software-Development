import { describe, expect, it } from "vitest";
import { createQualityRelations } from "@govlab/quality/core/factories/quality.factory.ts";
import { loadQualityData } from "@govlab/quality/core/loaders/quality.loader.ts";

describe("createQualityRelations", () => {
    it("builds a queryable relations facade over the bundled data", () => {
        const relations = createQualityRelations();
        expect(relations.concerns().length).toBeGreaterThan(0);
        expect(relations.rules().length).toBeGreaterThan(0);
        expect(relations.ecosystems()).toContain("javascript");
        expect(relations.concept("cyclomatic-complexity")).not.toBeNull();
    });
});

describe("loadQualityData", () => {
    it("exposes the ontology record arrays", () => {
        const data = loadQualityData();
        expect(data.concerns.length).toBeGreaterThan(0);
        expect(data.rules.length).toBeGreaterThan(0);
        expect(data.tools.length).toBeGreaterThan(0);
    });
});
