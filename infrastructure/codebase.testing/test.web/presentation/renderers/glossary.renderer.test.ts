import { ARCH_ANCHOR, LAYER_ANCHOR } from "@banes-lab/web/core/ids/ontology.ids.ts";
import { describe, expect, it } from "vitest";
import {
    lettersOf,
    renderGlossaryTab,
    renderLetterJumps,
    sortedEntries,
} from "@banes-lab/web/presentation/renderers/glossary.renderer.ts";
import { ARCHITECTURE_TABS } from "@banes-lab/web/core/generated/architecture.page.generated.ts";
import { GLOSSARY_ENTRIES } from "@banes-lab/web/configuration/strings/glossary.strings.ts";
import { GLOSSARY_LETTER_PREFIX } from "@banes-lab/web/configuration/constants/glossary.constants.ts";
import { GLOSSARY_TAB } from "@banes-lab/web/core/ids/architecture.ids.ts";
import type { GlossaryEntry } from "@banes-lab/web/types/block.types.ts";
import { ONTOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import type { Tab } from "@banes-lab/web/types/document.types.ts";
import { pagePath } from "@banes-lab/web/core/assets/link.assets.ts";

const FIXTURE: readonly GlossaryEntry[] = [
    { description: "Second.", term: "Beta" },
    { code: "AL", description: "First.", domains: ["One", "Two"], term: "Alpha" },
    { description: "Third.", term: "Bravo" },
];

const glossaryTab = function glossaryTab(): Tab {
    const tab = ARCHITECTURE_TABS.find((candidate) => candidate.id === GLOSSARY_TAB);
    if (tab === undefined) {
        throw new Error("the architecture page declares no glossary tab");
    }
    return tab;
};

describe("sortedEntries and lettersOf", () => {
    it("sorts by term and lists each leading letter once", () => {
        expect(sortedEntries(FIXTURE).map((entry) => entry.term)).toStrictEqual(["Alpha", "Beta", "Bravo"]);
        expect(lettersOf(FIXTURE)).toStrictEqual(["A", "B"]);
    });

    it("holds every glossary term unique", () => {
        const terms = GLOSSARY_ENTRIES.map((entry) => entry.term);
        expect(new Set(terms).size).toBe(terms.length);
    });

    it("joins every entry to the ontology: a record for its term, or the layer it is placed on", () => {
        const ontology = pagePath(ONTOLOGY_PAGE);
        for (const entry of GLOSSARY_ENTRIES) {
            expect(entry.href, entry.term).toBeDefined();
            expect(entry.href?.startsWith(ontology), entry.term).toBe(true);
            expect(entry.domains?.length ?? 0, entry.term).toBeGreaterThan(0);
        }
    });

    it("derives the kind of a joined entry from its record and keeps the page's own placement over the record's layer", () => {
        const joined = GLOSSARY_ENTRIES.filter((entry) => entry.href?.includes(ARCH_ANCHOR) === true);
        expect(joined.length).toBeGreaterThan(0);
        for (const entry of joined) {
            expect(entry.domains?.length, entry.term).toBe(2);
        }
        expect(GLOSSARY_ENTRIES.find((entry) => entry.term === "Encapsulation")?.domains).toStrictEqual([
            "principle",
            "Structural Core",
        ]);
        expect(GLOSSARY_ENTRIES.find((entry) => entry.term === "YAGNI")?.domains).toStrictEqual([
            "principle",
            "Evolution Principles",
        ]);
        expect(GLOSSARY_ENTRIES.find((entry) => entry.term === "Single Owner")?.href).toContain(LAYER_ANCHOR);
    });
});

describe("renderGlossaryTab", () => {
    const article = renderGlossaryTab(glossaryTab());

    it("renders the map section in the chapter shape before the letter groups, and one jump per letter for the footer", () => {
        const sections = [...article.querySelectorAll("section")];
        const map = sections.findIndex((section) => section.classList.contains("chapter-section-paired"));
        const glossary = sections.findIndex((section) => section.classList.contains("glossary-section"));
        expect(map).toBeGreaterThan(-1);
        expect(glossary).toBeGreaterThan(map);
        expect(sections[map]?.querySelectorAll(".chapter-panel").length).toBeGreaterThan(0);
        expect(article.querySelector(".glossary-diagrams")).toBeNull();
        expect(article.querySelectorAll(".glossary-group")).toHaveLength(lettersOf(GLOSSARY_ENTRIES).length);
        expect(renderLetterJumps(glossaryTab())).toHaveLength(lettersOf(GLOSSARY_ENTRIES).length);
    });

    it("renders one term per entry with its code and domains, under an addressable letter", () => {
        expect(article.querySelectorAll(".glossary-term")).toHaveLength(GLOSSARY_ENTRIES.length);
        expect(article.querySelector(`#${GLOSSARY_LETTER_PREFIX}A`)).not.toBeNull();
        expect(article.querySelectorAll(".glossary-code").length).toBeGreaterThan(0);
        expect(article.querySelectorAll(".glossary-domains")).toHaveLength(GLOSSARY_ENTRIES.length);
    });
});
