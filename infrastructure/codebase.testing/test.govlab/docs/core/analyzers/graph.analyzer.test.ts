import { describe, expect, it } from "vitest";
import { DEFAULT_ROOT_PREFIX } from "@govlab/docs/configuration/constants/document.constants.ts";
import type { DocNode } from "@govlab/docs/types/document.types.ts";
import { buildDocGraph } from "@govlab/docs/core/analyzers/graph.analyzer.ts";

const node = function node(name: string, over: Partial<DocNode> = {}): DocNode {
    return {
        concern: "ai",
        dependsOn: [],
        governs: [],
        links: [],
        name,
        relPath: `${DEFAULT_ROOT_PREFIX}notes/ai/${name}.md`,
        summary: "",
        supersedes: [],
        type: "note",
        ...over,
    };
};

describe("buildDocGraph", () => {
    it("resolves edges through the name registry", () => {
        const graph = buildDocGraph([node("a", { dependsOn: ["b"], links: ["c"] }), node("b"), node("c")]);
        expect(graph.deadEdges).toStrictEqual([]);
        expect(Object.keys(graph.byName).toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            "a",
            "b",
            "c",
        ]);
    });

    it("reports an edge to an unknown name as a dead edge with its field", () => {
        const graph = buildDocGraph([node("a", { dependsOn: ["ghost"], supersedes: ["missing"] }), node("b")]);
        const fields = graph.deadEdges
            .map((edge) => `${edge.field}:${edge.target}`)
            .toSorted((left, right) => left.localeCompare(right));
        expect(fields).toStrictEqual(["depends-on:ghost", "supersedes:missing"]);
    });

    it("marks a superseded target and leaves a governs edge unresolved by name", () => {
        const graph = buildDocGraph([node("new", { governs: ["src/thing.ts"], supersedes: ["old"] }), node("old")]);
        expect(graph.superseded).toStrictEqual(["old"]);
        expect(graph.deadEdges).toStrictEqual([]);
    });

    it("detects a depends-on cycle and passes an acyclic graph", () => {
        const cyclic = buildDocGraph([
            node("a", { dependsOn: ["b"] }),
            node("b", { dependsOn: ["c"] }),
            node("c", { dependsOn: ["a"] }),
        ]);
        expect(cyclic.cycles).toHaveLength(1);
        expect([...new Set(cyclic.cycles[0])].toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            "a",
            "b",
            "c",
        ]);
        const acyclic = buildDocGraph([
            node("a", { dependsOn: ["b", "c"] }),
            node("b", { dependsOn: ["c"] }),
            node("c"),
        ]);
        expect(acyclic.cycles).toStrictEqual([]);
    });

    it("reports a duplicate name and keeps the first", () => {
        const graph = buildDocGraph([node("dup", { summary: "first" }), node("dup", { summary: "second" })]);
        expect(graph.duplicateNames).toStrictEqual(["dup"]);
        expect(graph.byName["dup"]?.summary).toBe("first");
    });
});
