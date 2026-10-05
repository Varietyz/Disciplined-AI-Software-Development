import { describe, expect, it } from "vitest";
import { METHODOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { loadContentGraphs } from "@banes-lab/content/core/loaders/coverage.loader.ts";

describe("loadContentGraphs", () => {
    it("discovers the methodology graph by its export shape", async () => {
        const graphs = await loadContentGraphs();
        const methodology = graphs.find((graph) => graph.page === METHODOLOGY_PAGE);
        expect(methodology).toBeDefined();
        expect(Object.keys(methodology?.sections ?? {}).length).toBeGreaterThan(0);
    });
});
