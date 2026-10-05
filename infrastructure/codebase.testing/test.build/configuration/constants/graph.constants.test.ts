import { describe, expect, it } from "vitest";
import { GRAPH_FIELD_RULES } from "@banes-lab/build-scripts/configuration/constants/graph.constants.ts";

const DERIVED: readonly (readonly [string, boolean, string])[] = [
    ["reasoning:axis:nodes", true, "axis"],
    ["reasoning:layer:axes", true, "layer"],
    ["reasoning:dimension:surfaces", true, "dimension"],
    ["reasoning:invariant:surfaces", true, "invariant"],
    ["reasoning:technique:surfaces", true, "techniques"],
    ["reasoning:technique:mode", true, "techniques"],
    ["reasoning:technique:principle-ref", true, "techniques"],
    ["reasoning:lens:test-surfaces", true, "lens"],
    ["reasoning:universal-axis:lenses", true, "universal-axis"],
    ["reasoning:test-surface:evidence-grounds", false, "grounds"],
    ["reasoning:test-surface:predicate-grounds", false, "grounds"],
    ["reasoning:axis:contracts", true, "axis"],
    ["reasoning:math-type:contracts", true, "math-type"],
    ["stage:contracts", true, "stage"],
    ["force:contracts", true, "force"],
    ["algorithms:composed-by", true, "composes"],
    ["algorithms:derived-by", true, "derivation"],
    ["architecture:contracts", true, "principle"],
    ["reasoning:node:grounded-by", true, "grounds"],
    ["reasoning:mode:techniques", false, "techniques"],
];

describe("GRAPH_FIELD_RULES", () => {
    it("derives each schema-declared relation and inverse list, an inverse turning its field's direction around", () => {
        for (const [key, flip, relation] of DERIVED) {
            expect(GRAPH_FIELD_RULES.get(key), key).toEqual({ flip, relation });
        }
    });

    it("keeps the rows no record field states", () => {
        expect(GRAPH_FIELD_RULES.get("reasoning:loop:stages")).toEqual({ flip: false, relation: "contains" });
        expect(GRAPH_FIELD_RULES.get("architecture:referenced-by")).toEqual({ flip: false, relation: null });
    });
});
