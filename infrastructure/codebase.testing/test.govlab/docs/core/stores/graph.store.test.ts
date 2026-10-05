import { describe, expect, it } from "vitest";
import { GraphStore } from "@govlab/docs/core/stores/graph.store.ts";

describe("GraphStore", () => {
    it("keeps the first node per id, every edge, the visited set and the unresolved tally", () => {
        const store = new GraphStore();
        const source = { file: "a.ts", line: 1 };
        store.addNode({ id: "a", kind: "entry", label: "first", source });
        store.addNode({ id: "a", kind: "entry", label: "second", source });
        store.pushEdge({ from: "a", kind: "call", to: "a" });
        store.markVisited("a");
        store.bumpUnresolved();
        expect(store.result()).toStrictEqual({
            edges: [{ from: "a", kind: "call", to: "a" }],
            nodes: [{ id: "a", kind: "entry", label: "first", source }],
        });
        expect([store.hasVisited("a"), store.hasVisited("b"), store.unresolved]).toStrictEqual([true, false, 1]);
    });
});
