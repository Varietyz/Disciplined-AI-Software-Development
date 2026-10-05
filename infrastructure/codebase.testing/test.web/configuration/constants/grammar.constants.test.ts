import type { ContentGraph, GraphSection } from "@banes-lab/web/types/methodology.types.ts";
import { describe, expect, it } from "vitest";
import { ARCHITECTURE_GRAPH } from "@banes-lab/web/configuration/constants/architecture.constants.ts";
import { GRAMMAR_GRAPH } from "@banes-lab/web/configuration/constants/grammar.constants.ts";
import { GRAMMAR_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { GRAMMAR_TABS } from "@banes-lab/web/core/generated/grammar.page.generated.ts";
import { METHODOLOGY_GRAPH } from "@banes-lab/web/configuration/constants/methodology.constants.ts";

const graph: ContentGraph = GRAMMAR_GRAPH;

describe("GRAMMAR_GRAPH", () => {
    it("is keyed to the grammar page", () => {
        expect(graph.page).toBe(GRAMMAR_PAGE);
    });

    it("carries one entry per section the page's tabs declare and none besides", () => {
        const declared = GRAMMAR_TABS.flatMap((tab) => tab.sections.map((section) => section.id)).sort();
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

    it("teaches no concept the methodology or architecture pages already teach", () => {
        const elsewhere = new Set(
            [...Object.values(METHODOLOGY_GRAPH.sections), ...Object.values(ARCHITECTURE_GRAPH.sections)].flatMap(
                (section) => section.teaches,
            ),
        );
        const taught = Object.values(graph.sections).flatMap((section) => section.teaches);
        expect(new Set(taught).size).toBe(taught.length);
        expect(taught.filter((concept) => elsewhere.has(concept))).toStrictEqual([]);
    });

    it("requires only concepts taught earlier on this page or taught on another page", () => {
        const order = GRAMMAR_TABS.flatMap((tab) => tab.sections.map((section) => section.id));
        const elsewhere = new Set(
            [...Object.values(METHODOLOGY_GRAPH.sections), ...Object.values(ARCHITECTURE_GRAPH.sections)].flatMap(
                (section) => section.teaches,
            ),
        );
        const taughtBefore = new Set<string>();
        for (const id of order) {
            const section = graph.sections[id];
            for (const required of section?.requires ?? []) {
                expect(taughtBefore.has(required) || elsewhere.has(required)).toBe(true);
            }
            for (const concept of section?.teaches ?? []) {
                taughtBefore.add(concept);
            }
        }
    });
});
