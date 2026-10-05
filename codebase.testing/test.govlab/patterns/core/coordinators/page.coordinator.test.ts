import { describe, expect, it } from "vitest";
import { entry } from "../converters/package.fixture.ts";
import { renderOne } from "@govlab/patterns/core/coordinators/page.coordinator.ts";

const NODES = 3;

describe("renderOne", () => {
    it("renders a page's html, hardened walk and report row from its inlined files", () => {
        const output = renderOne(
            { crumbs: [], drilled: [], inlined: [entry("a.ts", NODES)], label: "mod", page: "code", rel: "" },
            {
                fanIn: new Map(),
                findings: [],
                graph: { edges: [], external: [] },
                insight: { definitions: 1, edges: 0, invariants: [], symbols: [], variants: [] },
                title: "mod",
            },
        );
        expect(output.mainCells).toHaveLength(NODES);
        expect(output.mainSvg.startsWith("<svg")).toBe(true);
        expect(output.nestedSvg).toBe("");
        expect(output.report).toMatchObject({ files: ["a.ts"], id: "code", label: "mod", walk: "code" });
        expect(output.html).toContain("<h1>mod</h1>");
    });
});
