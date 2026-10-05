import { describe, expect, it } from "vitest";
import type { Block } from "@banes-lab/web/types/block.types.ts";
import { ONTOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { ONTOLOGY_TABS } from "@banes-lab/web/configuration/strings/ontology.fragment.strings.ts";
import { tabPath } from "@banes-lab/web/core/assets/link.assets.ts";

const HREF_OPEN = 'href="';
const QUOTE = '"';
const ANCHOR = "#";

const textsOf = function textsOf(block: Block): string[] {
    if (block.kind === "text") {
        return [block.text];
    }
    if (block.kind === "list") {
        return [...block.items];
    }
    return block.kind === "glossary" ? block.entries.flatMap((entry) => [entry.term, entry.description]) : [];
};

const hrefsOf = function hrefsOf(text: string): string[] {
    const found: string[] = [];
    let at = text.indexOf(HREF_OPEN);
    while (at !== -1) {
        const close = text.indexOf(QUOTE, at + HREF_OPEN.length);
        found.push(text.slice(at + HREF_OPEN.length, close));
        at = text.indexOf(HREF_OPEN, close);
    }
    return found;
};

const anchorsOf = function anchorsOf(tab: (typeof ONTOLOGY_TABS)[number]): string[] {
    return tab.sections.flatMap((section) => [
        section.id,
        ...section.subsections.flatMap((sub) => (sub.id === undefined ? [] : [sub.id])),
    ]);
};

describe("ONTOLOGY_TABS", () => {
    it("builds each section once and gives every record a unique anchor", () => {
        const built = ONTOLOGY_TABS.flatMap((tab) => tab.sections.map((section) => section.id));
        expect(new Set(built).size).toBe(built.length);
        const anchors = ONTOLOGY_TABS.flatMap(anchorsOf);
        expect(new Set(anchors).size).toBe(anchors.length);
    });

    it("points every link it emits at a tab that exists and an anchor that tab renders", () => {
        const known = new Map(
            ONTOLOGY_TABS.map((tab) => [tabPath(ONTOLOGY_PAGE, ONTOLOGY_TABS, tab.id), new Set(anchorsOf(tab))]),
        );
        const hrefs = ONTOLOGY_TABS.flatMap((tab) =>
            tab.sections.flatMap((section) => [
                ...(section.blocks ?? []),
                ...section.subsections.flatMap((sub) => sub.blocks ?? []),
            ]),
        )
            .flatMap(textsOf)
            .flatMap(hrefsOf);
        expect(hrefs.length).toBeGreaterThan(5000);
        const broken = hrefs.filter((href) => {
            const cut = href.indexOf(ANCHOR);
            return known.get(href.slice(0, cut))?.has(href.slice(cut + 1)) !== true;
        });
        expect(broken).toStrictEqual([]);
    });
});
