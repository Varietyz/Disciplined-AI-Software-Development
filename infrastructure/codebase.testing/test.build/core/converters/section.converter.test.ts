import type { DiscoveredPage, Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import { describe, expect, it } from "vitest";
import {
    documentPages,
    sectionEdges,
    sectionLeaves,
    sectionPlans,
    tabsOf,
    withoutHeading,
} from "@banes-lab/build-scripts/core/converters/section.converter.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { placementsOf } from "@banes-lab/build-scripts/core/converters/location.converter.ts";
import { tabIndexPlans } from "@banes-lab/build-scripts/core/converters/index.page.converter.ts";

const SITE = "https://example.test";
const LOOP = "chapter:/method#loop";
const GATE = "chapter:/method/build#gate";

const bodies = function bodies(path: string, ids: readonly string[]): readonly string[] {
    return ids.map((id) => `## ${id}\n\nSee [the loop](/method#loop) on ${path}.`);
};

const METHOD: DiscoveredPage = {
    content: {
        kind: "tabbed",
        tabs: [
            { id: "start", label: "Start", sections: [{ id: "loop", intro: "The loop. More.", title: "The loop" }] },
            {
                id: "build",
                label: "Build",
                sections: [{ id: "gate", intro: "See [the loop](/method#loop).", title: "The gate" }],
            },
        ],
    },
    description: "The method.",
    id: "method",
    label: "Method",
    markdown: "",
    page: "method",
    path: "/method",
    tab: null,
    title: "Method — Site",
};

const FAQ: DiscoveredPage = {
    content: { kind: "document", sections: [{ id: "origin", title: "Origin" }] },
    description: "Questions.",
    id: "faq",
    label: "FAQ",
    markdown: "",
    page: "faq",
    path: "/faq",
    tab: null,
    title: "FAQ — Site",
};

const BUILD_ROUTE = { ...METHOD, label: "Build", path: "/method/build", tab: "build", title: "Build — Method — Site" };

const DISCOVERY: Discovery = {
    author: "Ada",
    consent: "Yes.",
    name: "Site",
    pages: [METHOD, FAQ],
    routes: [METHOD, BUILD_ROUTE, FAQ],
    site: SITE,
    summary: "A site.",
};

const summarize = (markdown: string): string | null => markdown.slice(0, markdown.indexOf(".") + 1) || null;

describe("tabsOf and documentPages", () => {
    it("reads a tabbed page's tabs at their route paths and a document page as one tab without an id", () => {
        expect(tabsOf(DISCOVERY, METHOD).map((tab) => [tab.id, tab.path])).toStrictEqual([
            ["start", "/method"],
            ["build", "/method/build"],
        ]);
        expect(tabsOf(DISCOVERY, FAQ).map((tab) => [tab.id, tab.path])).toStrictEqual([[null, "/faq"]]);
        expect(documentPages(DISCOVERY).map((page) => page.id)).toStrictEqual(["faq"]);
    });
});

describe("sectionPlans", () => {
    it("gives every section a chapter ref, its page href with a fragment and a leaf address with the tab explicit", () => {
        const plans = sectionPlans(DISCOVERY, summarize);
        expect(
            plans.map((plan) => [plan.identity.ref, plan.identity.address.json, plan.identity.summary]),
        ).toStrictEqual([
            [LOOP, "/json/method/start/loop", "The loop."],
            [GATE, "/json/method/build/gate", "See [the loop](/method#loop)."],
            ["chapter:/faq#origin", "/json/faq/origin", null],
        ]);
    });
});

describe("withoutHeading", () => {
    it("drops the section's own heading line and keeps the body", () => {
        expect(withoutHeading("\n## The loop\n\nBody.\n")).toBe("Body.");
        expect(withoutHeading("Body only.")).toBe("Body only.");
    });
});

describe("sectionEdges", () => {
    it("records each section's outgoing links and gives each target the sections that link to it", () => {
        const plans = sectionPlans(DISCOVERY, summarize);
        const linker = createLinker(
            plans.map((plan) => plan.identity),
            SITE,
            (href) => href,
        );
        const { incoming, outgoing } = sectionEdges(plans, linker);
        expect(outgoing.get(GATE)?.map((link) => link.ref)).toStrictEqual([LOOP]);
        expect(incoming.get(LOOP)?.map((link) => link.ref)).toStrictEqual([GATE]);
        expect(incoming.has(GATE)).toBe(false);
    });
});

describe("sectionLeaves", () => {
    it("links sections both ways, opens on the section title and relinks the body to leaves", () => {
        const plans = sectionPlans(DISCOVERY, summarize);
        const linker = createLinker(
            plans.map((plan) => plan.identity),
            SITE,
            (href) => href,
        );
        const numbers = new Map([[GATE, "2"]]);
        const placements = placementsOf(
            tabIndexPlans(DISCOVERY, plans),
            plans.map((plan) => plan.identity),
            SITE,
        );
        const leaves = sectionLeaves(plans, {
            bodies,
            evidence: () => [],
            folder: (ref) => (ref === LOOP ? { containedIn: null, contains: [linker.link("The gate", GATE)] } : null),
            graphs: [],
            grounds: (ref) => (ref === LOOP ? [linker.link("The gate", GATE)] : []),
            linkedBy: (ref) => (ref === LOOP ? [linker.link("The gate", GATE)] : []),
            linker,
            links: (ref) => (ref === GATE ? [linker.link("The loop", LOOP)] : []),
            navigation: () => null,
            numbers,
            placement: (ref) => placements.get(ref) ?? null,
        });
        const gate = leaves.find((leaf) => leaf.identity.ref === GATE);
        const loop = leaves.find((leaf) => leaf.identity.ref === LOOP);
        expect(gate?.data).toMatchObject({
            number: "2",
            page: "method",
            relations: [{ links: [{ ref: LOOP }], relation: "links-to" }],
            siblings: { next: null, previous: null },
            tab: "build",
            up: { json: `${SITE}/json/api/pages/method/build`, ref: "api:/method/build" },
        });
        expect(loop?.data).toMatchObject({
            number: null,
            relations: [
                { links: [{ ref: GATE }], relation: "contains" },
                { links: [{ ref: GATE }], relation: "linked-from" },
                { links: [{ ref: GATE }], relation: "evidence-for" },
            ],
        });
        expect(loop?.markdown).toContain("## Contains");
        expect(gate?.data).not.toHaveProperty("contains");
        expect(gate?.data).not.toHaveProperty("linkedBy");
        expect(gate?.markdown).toContain(`[the loop](${SITE}/method/start/loop.md)`);
        expect(gate?.markdown?.startsWith("# The gate")).toBe(true);
    });
});
