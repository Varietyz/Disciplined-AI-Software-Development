import { describe, expect, it } from "vitest";
import { identifierNames, syntaxDistribution } from "@govlab/patterns/core/analyzers/syntax.analyzer.ts";

describe("the syntax analyzer", () => {
    it("identifierNames keeps the text of identifier-shaped records only", () => {
        const records = [
            { nodeType: "identifier", text: "run" },
            { nodeType: "property_identifier", text: "log" },
            { nodeType: "call_expression", text: "run()" },
        ];
        expect(identifierNames(records)).toStrictEqual(["run", "log"]);
    });

    it("syntaxDistribution ranks common node types and lists the ones seen once", () => {
        const records = [{ nodeType: "a" }, { nodeType: "a" }, { nodeType: "b" }, {}];
        const distribution = syntaxDistribution(records);
        expect(distribution.invariants[0]).toStrictEqual({ count: 2, type: "a" });
        expect(distribution.variants.map((stat) => stat.type)).toStrictEqual(["b", "unknown"]);
    });
});
