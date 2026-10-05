import { collapseByLabel, depGraphOf } from "@govlab/docs/core/converters/graph.converter.ts";
import { describe, expect, it } from "vitest";
import type { CodeNode } from "@govlab/docs/types/graph.types.ts";
import { createMermaidParser } from "@govlab/docs/core/adapters/diagram.adapter.ts";
import { emitGraph } from "@govlab/docs/core/formatters/diagram.formatter.ts";

const DEPENDENT = "@govlab/dom-lab";
const DEPENDENCY = "@govlab/event-manager";

const parsed = async function parsed(source: string): Promise<string | null> {
    const parser = await createMermaidParser();
    return parser.available ? parser.parse(source) : parser.reason;
};

const nodeOf = function nodeOf(id: string, name: string): CodeNode {
    return { id, kind: "method", label: name, source: { file: "a.ts", line: 1 } };
};

describe("depGraphOf", () => {
    it("keeps only connected in-set edges unless isolated nodes are kept", () => {
        const modules = [
            { deps: [DEPENDENCY, "zod"], name: DEPENDENT },
            { deps: [], name: DEPENDENCY },
            { deps: [], name: "@govlab/lonely" },
        ];
        const model = depGraphOf(modules);
        expect(model.nodes.map((node) => node.id).toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            DEPENDENT,
            DEPENDENCY,
        ]);
        expect(model.edges).toHaveLength(1);
        expect(depGraphOf(modules, true).nodes).toHaveLength(3);
    });

    it("emits a graph the real mermaid grammar parses", async () => {
        const out = emitGraph(
            depGraphOf([
                { deps: [DEPENDENT], name: "@govlab/ai-bar" },
                { deps: [DEPENDENCY], name: DEPENDENT },
                { deps: [], name: DEPENDENCY },
            ]),
        );
        expect(await parsed(out)).toBeNull();
    });
});

describe("collapseByLabel", () => {
    it("merges nodes of one kind and label and drops the self edges the merge leaves", () => {
        const collapsed = collapseByLabel({
            edges: [
                { from: "a", kind: "call", to: "b" },
                { from: "a", kind: "call", to: "c" },
                { from: "b", kind: "call", to: "c" },
            ],
            nodes: [nodeOf("a", "run"), nodeOf("b", "step"), nodeOf("c", "step")],
        });
        expect(collapsed.nodes.map((node) => node.id)).toStrictEqual(["a", "b"]);
        expect(collapsed.edges).toHaveLength(1);
        expect(collapsed.edges[0]).toMatchObject({ from: "a", kind: "call", to: "b" });
        expect(collapsed.edges[0]?.label).toBeUndefined();
    });
});
