import { describe, expect, it } from "vitest";
import { FieldAnalyzer } from "@govlab/patterns/core/analyzers/field.analyzer.ts";
import { registerRepresentation } from "@govlab/patterns/core/registries/representation.registry.ts";

describe("FieldAnalyzer", () => {
    it("binds each registered representation and emits an analysis node per productive one", () => {
        const analyzer = new FieldAnalyzer("color", ["distribution", "unregistered"]);
        analyzer.update([{ color: "red" }, { color: "blue" }]);
        const { nodes, findings } = analyzer.produce();
        expect(nodes[0]?.id).toBe("color:distribution");
        expect(nodes).toHaveLength(findings.length + 1);
    });

    it("emits no node for a representation that produces no finding", () => {
        registerRepresentation({
            applicable: [],
            create() {
                return { findings: () => [], sample: () => null, update: () => {} };
            },
            name: "silent",
        });
        expect(new FieldAnalyzer("color", ["silent"]).produce()).toStrictEqual({ findings: [], nodes: [] });
    });
});
