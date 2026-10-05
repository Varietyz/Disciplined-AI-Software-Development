import { describe, expect, it } from "vitest";
import { renderNested, renderPage } from "@govlab/patterns/core/renderers/report.renderer.ts";
import type { PageRender } from "@govlab/patterns/types/report.types.ts";

const page: PageRender = {
    crumbs: [{ label: "mod", page: "code" }],
    definitions: 1,
    distribution: { invariants: [{ count: 2, type: "identifier" }], variants: [] },
    fanIn: new Map([["run", 2]]),
    findings: [],
    label: "mod / core",
    mainCells: [],
    mainSvg: "<svg/>",
    nested: [],
    nestedCells: [],
    nestedSubtitle: "",
    nestedSvg: "",
    symbols: [
        {
            callable: true,
            exported: true,
            file: "core/a.ts",
            flow: "entry",
            inDegree: 0,
            kind: "function_declaration",
            line: 1,
            local: false,
            name: "run",
            outDegree: 1,
            role: "definition",
        },
    ],
    walkSubtitle: "1 steps · follow the arrows",
};

describe("the report renderer", () => {
    it("renders the page head, crumbs, walk figure, definitions and the inspector script", () => {
        const html = renderPage(page);
        expect(html).toContain('<a href="code.generated.html">mod</a>');
        expect(html).toContain("<h1>mod / core</h1>");
        expect(html).toContain('<figure data-walk="main"><svg/></figure>');
        expect(html).toContain("run <span");
        expect(html).toContain('id="hexcells"');
    });

    it("renders a nested drill-down table linking each folder to its page", () => {
        const html = renderNested("<figure/>", [{ anomalies: 1, count: 3, defs: 2, label: "core", page: "core" }]);
        expect(html).toContain('<a href="core.generated.html">core</a>');
        expect(html).toContain("&#9888; 1");
    });
});
