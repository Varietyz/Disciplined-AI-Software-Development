import { describe, expect, it } from "vitest";
import type { DiagramContext } from "@govlab/docs/types/figure.types.ts";
import { renderCharts } from "@govlab/docs/core/formatters/figure.formatter.ts";

const contextWith = function contextWith(moduleDeps: DiagramContext["moduleDeps"]): DiagramContext {
    return {
        codeGraph: null,
        layout: { cluster: false, direction: "TD", nodeCap: 45, perAxis: false },
        moduleDeps,
        moduleName: "@govlab/a",
        shape: "leaf",
    };
};

describe("renderCharts", () => {
    it("renders a titled section per applicable diagram under the module heading", () => {
        const charts = renderCharts(
            contextWith([
                { deps: ["@govlab/b"], name: "@govlab/a" },
                { deps: [], name: "@govlab/b" },
            ]),
        );
        expect(charts?.startsWith("# @govlab/a — architecture charts\n\n")).toBe(true);
        expect(charts).toContain("## Dependencies");
        expect(charts).toContain("```mermaid");
    });

    it("renders nothing when no diagram applies", () => {
        expect(renderCharts(contextWith([]))).toBeNull();
    });
});
