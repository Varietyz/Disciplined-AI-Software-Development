import { describe, expect, it } from "vitest";
import type { CodeGraph } from "@govlab/docs/types/graph.types.ts";
import type { DiagramContext } from "@govlab/docs/types/figure.types.ts";
import { diagram } from "@govlab/docs/core/plugins/diagram.dependency.plugin.ts";
import { parseMermaid } from "./mermaid.fixture.ts";

const MIN_SOURCES = 2;

const withGraph = function withGraph(edges: CodeGraph["edges"]): DiagramContext {
    return {
        codeGraph: {
            edges,
            nodes: [
                { id: "factory", kind: "factory", label: "createThing", source: { file: "src/thing.ts", line: 3 } },
                { id: "store", kind: "store", label: "Registry", source: { file: "src/registry.ts", line: 8 } },
                { id: "worker", kind: "collaborator", label: "Worker", source: { file: "src/worker.ts", line: 5 } },
            ],
        },
        layout: { cluster: false, direction: "TD", nodeCap: 45, perAxis: false },
        moduleDeps: [],
        moduleName: "sample",
        shape: "leaf",
    };
};

describe("the data-flow diagram", () => {
    it("renders dependency edges as valid, source-traceable mermaid", async () => {
        const context = withGraph([
            { from: "factory", kind: "dependency", label: "new", to: "store" },
            { from: "factory", kind: "dependency", label: "new", to: "worker" },
        ]);
        expect(diagram.id).toBe("data-flow");
        expect(diagram.appliesTo(context)).toBe(true);
        const rendered = diagram.render(context);
        expect(await parseMermaid(rendered?.mermaid ?? "")).toBeNull();
        expect(rendered?.sources.length ?? 0).toBeGreaterThanOrEqual(MIN_SOURCES);
        expect(rendered?.sources.every((source) => source.file.length > 0 && source.line > 0)).toBe(true);
    });

    it("does not apply to a call-only graph", () => {
        const context = withGraph([{ from: "factory", kind: "call", to: "worker" }]);
        expect(diagram.appliesTo(context)).toBe(false);
        expect(diagram.render(context)).toBeNull();
    });
});
