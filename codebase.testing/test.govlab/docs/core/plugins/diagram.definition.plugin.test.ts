import { describe, expect, it } from "vitest";
import type { DiagramContext } from "@govlab/docs/types/figure.types.ts";
import type { TypeGraph } from "@govlab/docs/types/graph.types.ts";
import { diagram } from "@govlab/docs/core/plugins/diagram.definition.plugin.ts";
import { parseMermaid } from "./mermaid.fixture.ts";

const MIN_SOURCES = 2;

const withGraph = function withGraph(edges: TypeGraph["edges"]): DiagramContext {
    return {
        codeGraph: null,
        layout: { cluster: false, direction: "TD", nodeCap: 45, perAxis: false },
        moduleDeps: [],
        moduleName: "sample",
        shape: "leaf",
        typeGraph: {
            edges,
            nodes: [
                {
                    id: "base",
                    kind: "interface",
                    label: "Base",
                    members: ["id"],
                    source: { file: "src/base.ts", line: 2 },
                },
                {
                    id: "impl",
                    kind: "class",
                    label: "Impl",
                    members: ["id", "run"],
                    source: { file: "src/impl.ts", line: 4 },
                },
                {
                    id: "opts",
                    kind: "interface",
                    label: "Options",
                    members: ["base"],
                    source: { file: "src/opts.ts", line: 3 },
                },
            ],
        },
    };
};

describe("the type-relationship diagram", () => {
    it("renders heritage and reference edges as valid, source-traceable mermaid", async () => {
        const context = withGraph([
            { from: "impl", kind: "implements", to: "base" },
            { from: "opts", kind: "has", to: "base" },
        ]);
        expect(diagram.id).toBe("type-relationship");
        expect(diagram.appliesTo(context)).toBe(true);
        const rendered = diagram.render(context);
        expect(await parseMermaid(rendered?.mermaid ?? "")).toBeNull();
        expect(rendered?.sources.length ?? 0).toBeGreaterThanOrEqual(MIN_SOURCES);
        expect(rendered?.sources.every((source) => source.file.length > 0 && source.line > 0)).toBe(true);
    });

    it("does not apply to an edgeless graph", () => {
        const context = withGraph([]);
        expect(diagram.appliesTo(context)).toBe(false);
        expect(diagram.render(context)).toBeNull();
    });
});
