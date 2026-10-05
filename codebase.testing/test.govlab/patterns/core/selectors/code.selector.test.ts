import { describe, expect, it } from "vitest";
import { sortedEdges, unresolvedNames } from "@govlab/patterns/core/selectors/code.selector.ts";

describe("the code selectors", () => {
    it("sort edges deterministically and list unresolved names once, in order", () => {
        const graph = {
            edges: [
                { file: "b", from: "b", line: 1, to: "c" },
                { file: "a", from: "a", line: 1, to: "b" },
            ],
            external: [
                { caller: "x", file: "f", line: 1, name: "log" },
                { caller: "y", file: "f", line: 2, name: "fetch" },
                { caller: "z", file: "f", line: 3, name: "log" },
            ],
        };
        expect(sortedEdges(graph).map((edge) => edge.from)).toStrictEqual(["a", "b"]);
        expect(unresolvedNames(graph)).toStrictEqual(["fetch", "log"]);
    });
});
