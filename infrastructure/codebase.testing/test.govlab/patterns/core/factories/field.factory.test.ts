import { describe, expect, it } from "vitest";
import { FieldAnalyzer } from "@govlab/patterns/core/analyzers/field.analyzer.ts";
import { buildAnalyzers } from "@govlab/patterns/core/factories/field.factory.ts";

describe("buildAnalyzers", () => {
    it("builds one analyzer per mapped field", () => {
        const analyzers = buildAnalyzers(
            new Map([
                ["color", ["distribution"]],
                ["score", ["vector"]],
            ]),
        );
        expect([...analyzers.keys()]).toStrictEqual(["color", "score"]);
        expect(analyzers.get("color")).toBeInstanceOf(FieldAnalyzer);
    });
});
