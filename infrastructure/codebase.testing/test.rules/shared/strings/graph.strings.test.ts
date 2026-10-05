import { describe, expect, it } from "vitest";
import { malformedClosureGraph } from "@ssot/govlab/shared/strings/graph.strings.ts";

describe("malformedClosureGraph", () => {
    it("names the graph file and the fields it has to carry", () => {
        expect(malformedClosureGraph("graph.json", ["imports", "exports"])).toContain(
            "graph.json is missing one of the fields imports, exports",
        );
    });
});
