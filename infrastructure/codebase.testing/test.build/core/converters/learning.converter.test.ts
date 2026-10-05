import type { LearningRouter, TabRecord, Unit } from "@banes-lab/build-scripts/types/learning.types.ts";
import {
    chunkCode,
    heldIn,
    orderUnits,
    safeLabel,
    sectionsIn,
    teachingBlocks,
    teachingRoute,
    textOf,
    unitsOf,
} from "@banes-lab/build-scripts/core/converters/learning.converter.ts";
import { describe, expect, it } from "vitest";
import type { ContentGraph } from "@banes-lab/web/types/methodology.types.ts";
import { SITE_PAGES } from "@banes-lab/build-scripts/configuration/constants/learning.constants.ts";

const SPINE = "disciplined-methodology";
const OTHER = "pag";
const ROUTER: LearningRouter = {
    pagePath: (page) => `/${page}`,
    tabLink: (page, tab, section) => `/${page}/${tab}#${section ?? ""}`,
};

const unit = function unit(tab: string, teaches: readonly string[], external: readonly string[]): Unit {
    return { external, first: false, label: tab, page: OTHER, sections: [{ id: tab, title: tab }], tab, teaches };
};

const GRAPHS: readonly ContentGraph[] = [
    {
        page: SPINE,
        sections: {
            first: { requires: [], teaches: ["loop"], traces: [] },
            second: { requires: ["loop"], teaches: ["gate"], traces: [] },
        },
    },
    {
        page: OTHER,
        sections: {
            grammar: { requires: ["loop"], teaches: ["directive"], traces: [] },
            words: { narrative: true, requires: [], teaches: [], traces: [] },
        },
    },
];

const TABS: ReadonlyMap<string, readonly TabRecord[]> = new Map([
    [
        SPINE,
        [
            { id: "start", label: "Start", sections: [{ id: "first", title: "The loop" }] },
            { id: "build", label: "Build", sections: [{ id: "second", title: "The gate" }] },
        ],
    ],
    [
        OTHER,
        [
            { id: "guide", label: "Guide", sections: [{ id: "grammar", title: "A directive" }] },
            { id: "keywords", label: "Keywords", sections: [{ id: "words", title: "Keywords" }] },
        ],
    ],
]);

const tabsFor = function tabsFor(page: string): readonly TabRecord[] {
    return TABS.get(page) ?? [];
};

describe("safeLabel", () => {
    it("substitutes every character the diagram grammar reserves", () => {
        expect(safeLabel('a "quoted" [bracket] (paren) {brace}')).toBe("a 'quoted' 'bracket' 'paren' 'brace'");
    });

    it("folds a typographic character and drops what the renderer cannot measure", () => {
        expect(safeLabel("Bane’s — loop")).toBe("Bane's - loop");
        expect(safeLabel("A·B✅C")).toBe("A-BC");
    });
});

describe("chunkCode and textOf", () => {
    it("allocates two letters per block and reads only strings", () => {
        expect(chunkCode(0)).toBe("aa");
        expect(chunkCode(27)).toBe("bb");
        expect(textOf(3)).toBe("");
        expect(textOf("x")).toBe("x");
    });
});

describe("sectionsIn and heldIn", () => {
    it("keep the titled sections of a tab and the graph entries they carry", () => {
        const tab: TabRecord = { id: "t", label: "T", sections: [{ id: "first", title: "The loop" }, { id: "x" }] };
        const sections = sectionsIn(tab);
        expect(sections.map((section) => section.id)).toStrictEqual(["first"]);
        const [spine] = GRAPHS;
        expect(spine === undefined ? [] : heldIn(spine, sections).map((entry) => entry.teaches)).toStrictEqual([
            ["loop"],
        ]);
        expect(sectionsIn({ id: "empty", label: "E" })).toStrictEqual([]);
    });
});

describe("unitsOf", () => {
    it("keeps a tab that teaches and drops one that only narrates", () => {
        const graph = GRAPHS.find((held) => held.page === OTHER);
        const units = graph === undefined ? [] : unitsOf(OTHER, graph, tabsFor(OTHER));
        expect(units.map((held) => held.tab)).toStrictEqual(["guide"]);
        expect(units[0]?.external).toStrictEqual(["loop"]);
        expect(units[0]?.first).toBe(true);
    });
});

describe("orderUnits", () => {
    it("places each other tab after the first spine tab that completes its requirements", () => {
        const spine = [unit("s1", ["a"], []), unit("s2", ["b"], [])];
        const others = [unit("x", ["x"], ["b"]), unit("y", ["y"], ["a"]), unit("z", ["z"], [])];
        expect(orderUnits(spine, others).map((held) => held.tab)).toStrictEqual(["s1", "y", "z", "s2", "x"]);
    });

    it("keeps a tab whose requirement no page teaches, at the end, so nothing is dropped", () => {
        const ordered = orderUnits([unit("s1", ["a"], [])], [unit("orphan", ["o"], ["nowhere"])]);
        expect(ordered.map((held) => held.tab)).toStrictEqual(["s1", "orphan"]);
    });
});

describe("teachingRoute", () => {
    it("numbers every stop by its place in the route, gives each a unique id and resolves its prerequisites to stops", () => {
        const stops = teachingRoute(ROUTER, GRAPHS, tabsFor);
        expect(stops.map((stop) => stop.label)).toStrictEqual(["01 - The loop", "02 - A directive", "03 - The gate"]);
        expect(new Set(stops.map((stop) => stop.id)).size).toBe(stops.length);
        const [loop, directive, gate] = stops;
        expect(directive?.requires).toStrictEqual([loop?.id]);
        expect(gate?.requires).toStrictEqual([loop?.id]);
    });

    it("addresses a first-tab stop by the page path, because only the other tabs are served at their own path", () => {
        const [loop, directive, gate] = teachingRoute(ROUTER, GRAPHS, tabsFor);
        expect(loop?.path).toBe(`/${SPINE}#first`);
        expect(directive?.path).toBe(`/${OTHER}#grammar`);
        expect(gate?.path).toBe(`/${SPINE}/build#second`);
    });
});

describe("teachingBlocks", () => {
    it("groups consecutive stops of one block and carries their prerequisites", () => {
        const blocks = teachingBlocks(teachingRoute(ROUTER, GRAPHS, tabsFor));
        expect(blocks.map((block) => block.label)).toStrictEqual(["Start", "Guide", "Build"]);
        expect(blocks[2]?.stops[0]?.requires).toHaveLength(1);
    });
});

describe("SITE_PAGES", () => {
    it("declares the page order the tab module also reads", () => {
        expect(SITE_PAGES).toContain(SPINE);
    });
});
