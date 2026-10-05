import {
    DISTRIBUTION_STRINGS,
    GRAPH_STRINGS,
    GRID_STRINGS,
    SEQUENCE_STRINGS,
    TREE_STRINGS,
    VECTOR_STRINGS,
} from "@govlab/patterns/configuration/strings/representation.strings.ts";
import { describe, expect, it } from "vitest";

describe("the representation strings", () => {
    it("fill each distribution template with its measures", () => {
        expect(DISTRIBUTION_STRINGS.freqObserved("4", "3")).toBe("4 records over 3 distinct values");
        expect(DISTRIBUTION_STRINGS.uniformExplained("0.5", DISTRIBUTION_STRINGS.uniformUniform)).toBe(
            "p=0.5: consistent with a uniform null",
        );
    });

    it("fill each list and structure template with its measures", () => {
        expect(GRAPH_STRINGS.cooccurrenceObserved("3", "1.50")).toBe("3 members, mean degree 1.50");
        expect(TREE_STRINGS.structureObserved("2", "3")).toBe("depth 2, branching 3");
        expect(GRID_STRINGS.densityExplained("0,0", "2")).toBe("densest cell 0,0 (2)");
    });

    it("fill each series template with its measures", () => {
        expect(SEQUENCE_STRINGS.runsObserved("1.50", "2")).toBe("mean run 1.50, longest 2");
        expect(VECTOR_STRINGS.distributionObserved("2.00", "0.50")).toBe("mean 2.00, sd 0.50");
    });
});
