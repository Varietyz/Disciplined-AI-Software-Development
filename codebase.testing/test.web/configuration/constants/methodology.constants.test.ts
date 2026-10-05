import type { ContentGraph, GraphSection } from "@banes-lab/web/types/methodology.types.ts";
import { describe, expect, it } from "vitest";
import { METHODOLOGY_GRAPH } from "@banes-lab/web/configuration/constants/methodology.constants.ts";
import { METHODOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { METHODOLOGY_TABS } from "@banes-lab/web/core/generated/methodology.page.generated.ts";

const graph: ContentGraph = METHODOLOGY_GRAPH;

describe("METHODOLOGY_GRAPH", () => {
    it("is keyed to the methodology page", () => {
        expect(graph.page).toBe(METHODOLOGY_PAGE);
    });

    it("carries one entry per section the page's tabs declare and none besides", () => {
        const declared = METHODOLOGY_TABS.flatMap((tab) => tab.sections.map((section) => section.id)).sort();
        expect(Object.keys(graph.sections).sort()).toStrictEqual(declared);
    });

    it("either teaches and traces a section or declares it narrative, never neither and never both", () => {
        const sections: GraphSection[] = Object.values(graph.sections);
        for (const section of sections) {
            if (section.narrative === true) {
                expect(section.teaches).toHaveLength(0);
                expect(section.traces).toHaveLength(0);
            } else {
                expect(section.teaches.length).toBeGreaterThan(0);
                expect(section.traces.length).toBeGreaterThan(0);
            }
        }
    });

    it("teaches every concept exactly once", () => {
        const taught = Object.values(graph.sections).flatMap((section) => section.teaches);
        expect(new Set(taught).size).toBe(taught.length);
    });
});
