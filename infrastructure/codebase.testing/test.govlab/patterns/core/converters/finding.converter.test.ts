import { describe, expect, it } from "vitest";
import { explanationFinding } from "@govlab/patterns/core/factories/finding.factory.ts";
import { withSupport } from "@govlab/patterns/core/converters/finding.converter.ts";

const SUPPORT = 4;

describe("withSupport", () => {
    it("drops absent findings and stamps the support on the rest", () => {
        const finding = explanationFinding({
            analysis: "frequency",
            explained: "e",
            field: "f",
            name: "n",
            observation: {},
            observed: "o",
            ontology: "probability",
            representation: "symbolic",
        });
        expect(withSupport([finding, null], SUPPORT).map((entry) => entry.support)).toStrictEqual([SUPPORT]);
    });
});
