import { describe, expect, it } from "vitest";
import type { CodeGraph } from "@govlab/docs/types/graph.types.ts";
import type { DiagramContext } from "@govlab/docs/types/figure.types.ts";
import { diagram } from "@govlab/docs/core/plugins/diagram.machine.plugin.ts";
import { mermaidHardening } from "@govlab/docs/core/analyzers/diagram.analyzer.ts";

const STATES = ["idle", "running", "done"];

const withState = function withState(transitions: { from: string; to: string }[]): DiagramContext {
    const codeGraph: CodeGraph = {
        edges: [],
        nodes: [],
        protocol: null,
        state: { initial: "idle", states: STATES, transitions },
    };
    return {
        codeGraph,
        layout: { cluster: false, direction: "TD", nodeCap: 15, perAxis: false },
        moduleDeps: [],
        moduleName: "@govlab/demo",
        shape: "leaf",
    };
};

describe("the state diagram", () => {
    it("applies only with a transition table and emits a hardened state diagram", () => {
        expect(diagram.appliesTo(withState([]))).toBe(false);
        const context = withState([
            { from: "idle", to: "running" },
            { from: "running", to: "done" },
        ]);
        expect(diagram.appliesTo(context)).toBe(true);
        const mermaid = diagram.render(context)?.mermaid ?? "";
        expect(mermaid.startsWith("stateDiagram-v2")).toBe(true);
        expect(mermaidHardening(["```mermaid", mermaid, "```"].join("\n"))).toStrictEqual([]);
    });
});
