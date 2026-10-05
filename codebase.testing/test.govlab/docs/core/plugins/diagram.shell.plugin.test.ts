import { describe, expect, it } from "vitest";
import type { DiagramContext } from "@govlab/docs/types/figure.types.ts";
import { diagram } from "@govlab/docs/core/plugins/diagram.shell.plugin.ts";
import { mermaidHardening } from "@govlab/docs/core/analyzers/diagram.analyzer.ts";

const context = function context(scripts?: Record<string, string>): DiagramContext {
    return {
        codeGraph: null,
        layout: { cluster: false, direction: "TD", nodeCap: 45, perAxis: false },
        moduleDeps: [],
        moduleName: "@govlab/demo",
        shape: "leaf",
        ...(scripts === undefined ? {} : { scripts }),
    };
};

describe("the lifecycle diagram", () => {
    it("comes first and emits a hardened flowchart from the scripts", () => {
        const withScripts = context({ build: "npm run compile", compile: "tsc -b", start: "node index.js" });
        expect(diagram.order).toBe(0);
        expect(diagram.appliesTo(withScripts)).toBe(true);
        const mermaid = diagram.render(withScripts)?.mermaid ?? "";
        expect(mermaid).toContain("flowchart TD");
        expect(mermaidHardening(["```mermaid", mermaid, "```"].join("\n"))).toStrictEqual([]);
    });

    it("does not apply to a package with no scripts", () => {
        expect(diagram.appliesTo(context())).toBe(false);
    });
});
