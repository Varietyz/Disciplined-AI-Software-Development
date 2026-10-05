import {
    ROUTE_SECTIONS_POPULATION,
    ROUTE_SECTION_PARTS,
} from "@banes-lab/build-scripts/configuration/constants/learning.constants.ts";
import { describe, expect, it } from "vitest";
import type { ContentGraph } from "@banes-lab/web/types/methodology.types.ts";
import type { TabRecord } from "@banes-lab/build-scripts/types/learning.types.ts";
import { routeSections } from "@banes-lab/build-scripts/core/analyzers/learning.analyzer.ts";

const GRAPHED = "pag";
const GRAPHLESS = "ontology";

const GRAPHS: readonly ContentGraph[] = [
    {
        page: GRAPHED,
        sections: {
            held: { requires: [], teaches: ["directive"], traces: [] },
            quiet: { requires: [], teaches: [], traces: [] },
        },
    },
];

const TABS: ReadonlyMap<string, readonly TabRecord[]> = new Map([
    [
        GRAPHED,
        [
            {
                id: "grammar",
                sections: [{ id: "held", title: "Held" }, { id: "loose", title: "Loose" }, { id: "bare" }],
            },
            { id: "words", sections: [{ id: "quiet", title: "Quiet" }] },
        ],
    ],
    [GRAPHLESS, [{ id: "principles", sections: [{ id: "record", title: "Record" }] }]],
]);

describe("routeSections", () => {
    it("counts every section of every site page into exactly one part", () => {
        expect(routeSections(GRAPHS, (page) => TABS.get(page) ?? [])).toEqual({
            name: ROUTE_SECTIONS_POPULATION,
            parts: {
                [ROUTE_SECTION_PARTS.graphless]: 1,
                [ROUTE_SECTION_PARTS.routed]: 1,
                [ROUTE_SECTION_PARTS.silent]: 1,
                [ROUTE_SECTION_PARTS.unheld]: 1,
                [ROUTE_SECTION_PARTS.untitled]: 1,
            },
            whole: 5,
        });
    });

    it("reports an empty site as an empty population", () => {
        const empty = routeSections([], () => []);
        expect(empty.whole).toBe(0);
        expect(Object.values(empty.parts).every((count) => count === 0)).toBe(true);
    });
});
