import { accLines, emitGraph } from "@govlab/docs/core/formatters/diagram.formatter.ts";
import { describe, expect, it } from "vitest";
import type { GraphModel } from "@govlab/docs/types/diagram.types.ts";
import { createMermaidParser } from "@govlab/docs/core/adapters/diagram.adapter.ts";
import { mermaidHardening } from "@govlab/docs/core/analyzers/diagram.analyzer.ts";

const parsed = async function parsed(source: string): Promise<string | null> {
    const parser = await createMermaidParser();
    return parser.available ? parser.parse(source) : parser.reason;
};

const fenced = function fenced(mermaid: string): string {
    return ["```mermaid", mermaid, "```", ""].join("\n");
};

const WIDENED: GraphModel = {
    accDescr: "entry to exit",
    accTitle: "dom-lab flow",
    classDefs: [{ name: "entryKind", stroke: "#2f6f4f" }],
    direction: "TD",
    edges: [
        { from: "entry", to: "dec", weight: "call" },
        { from: "dec", label: "on click", to: "collab", weight: "hook" },
        { from: "dec", label: "cleanup", to: "store", weight: "teardown" },
        { from: "collab", to: "exit", weight: "call" },
    ],
    kind: "flowchart",
    nodes: [
        { class: "entryKind", id: "entry", label: "createDomLab options", shape: "endpoint" },
        { id: "dec", label: "reserved key", shape: "decision" },
        { id: "store", label: "refs map", shape: "store" },
        { id: "collab", label: "eventManager", shape: "collaborator" },
        { id: "exit", label: "element", shape: "endpoint" },
    ],
    subgraphs: [{ id: "hooks", nodeIds: ["dec", "collab"], title: "Hook wiring" }],
};

describe("emitGraph", () => {
    it("emits hardening-clean output even from hostile labels", () => {
        const model: GraphModel = {
            direction: "LR",
            edges: [{ from: "@govlab/a-b", label: "uses (x); y", to: "@govlab/c" }],
            kind: "graph",
            nodes: [
                { id: "@govlab/a-b", label: 'A (rounded) — node; with <br/> [x] & "q"' },
                { id: "@govlab/c", label: "cafe · in ∈ ∪ set" },
            ],
        };
        const markdown = fenced(emitGraph(model));
        expect(mermaidHardening(markdown)).toStrictEqual([]);
    });

    it("emits mermaid-safe node ids", () => {
        const out = emitGraph({
            direction: "LR",
            edges: [],
            kind: "graph",
            nodes: [{ id: "@govlab/dom-lab", label: "dom-lab" }],
        });
        expect(out).toContain('_govlab_dom_lab["dom-lab"]');
    });

    it("emits a widened flowchart that parses and is byte-deterministic", async () => {
        const out = emitGraph(WIDENED);
        expect(await parsed(out)).toBeNull();
        expect(emitGraph(WIDENED)).toBe(out);
    });
});

describe("accLines", () => {
    it("emits the accessible title and description lines that are present", () => {
        expect(accLines({ accDescr: "d", accTitle: "t" }).join("\n")).toContain("accTitle: t");
        expect(accLines({})).toStrictEqual([]);
    });
});
