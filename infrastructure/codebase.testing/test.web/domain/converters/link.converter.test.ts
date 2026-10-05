import type { Block, LessonBlock } from "@banes-lab/web/types/block.types.ts";
import type { LinkedPage, VocabularyEntry } from "@banes-lab/web/types/vocabulary.types.ts";
import type { Section, Tab } from "@banes-lab/web/types/document.types.ts";
import { chapterRef, chapterVocabulary } from "@banes-lab/web/domain/converters/chapter.converter.ts";
import { describe, expect, it } from "vitest";
import {
    entryFor,
    joinGlossary,
    linkPages,
    linkSection,
    linkTabs,
    linkText,
} from "@banes-lab/web/domain/converters/link.vocabulary.converter.ts";
import { layerLink, nodeLink, stageLink } from "@banes-lab/web/domain/converters/link.converter.ts";
import { buildPhraseIndex } from "@banes-lab/web/core/matchers/vocabulary.matcher.ts";

const STRUCTURAL = "Structural Core";
const RESOURCE = "Resource Core";

const VOCABULARY: readonly VocabularyEntry[] = [
    {
        code: null,
        kind: "principle",
        layer: "Correctness Core",
        phrase: "Fail Fast",
        prose: true,
        ref: "architecture:fail-fast",
    },
    {
        code: "SRP",
        kind: "principle",
        layer: STRUCTURAL,
        phrase: "Single Responsibility Principle",
        prose: true,
        ref: "architecture:single-responsibility",
    },
    {
        code: null,
        kind: "quality-attribute",
        layer: STRUCTURAL,
        phrase: "High Cohesion",
        prose: true,
        ref: "architecture:high-cohesion",
    },
    { code: null, kind: "layer", layer: RESOURCE, phrase: RESOURCE, prose: true, ref: "layer:resource-core" },
    { code: null, kind: "principle", layer: STRUCTURAL, phrase: "YAGNI", prose: false, ref: "lexicon:yagni" },
    { code: null, kind: "principle", layer: null, phrase: "Unknown Collection", prose: true, ref: "nowhere:unknown" },
];

const INDEX = buildPhraseIndex(VOCABULARY);

const section = function section(): Section {
    return {
        blocks: [{ kind: "text", text: "Fail fast here." }],
        icon: "icon",
        id: "a-section",
        intro: "Fail fast in the intro.",
        subsections: [
            {
                blocks: [
                    {
                        application: "Apply fail fast.",
                        cause: "High cohesion is the cause.",
                        decision: "Decide.",
                        failureMode: "It fails.",
                        kind: "lesson",
                        principle: "High cohesion holds.",
                        problem: "A problem.",
                        validation: "Validate.",
                    },
                    { code: "fail fast", kind: "code", language: "text", title: "Fail fast" },
                ],
                content: "Fail fast again.",
                title: "Sub",
            },
        ],
        title: "Section",
    };
};

describe("linkText", () => {
    it("wraps the matched phrase in a link to the ontology record and leaves an unresolvable collection as text", () => {
        expect(linkText("Fail fast now.", { index: INDEX, seen: new Set() })).toBe(
            '<a href="/ontology#architecture-fail-fast">Fail fast</a> now.',
        );
        expect(linkText("An unknown collection.", { index: INDEX, seen: new Set() })).toBe("An unknown collection.");
    });
});

const textOf = function textOf(block: Block | undefined): string {
    return block?.kind === "text" ? block.text : "";
};

const lessonOf = function lessonOf(block: Block | undefined): LessonBlock | null {
    return block?.kind === "lesson" ? block : null;
};

describe("linkSection", () => {
    const linked = linkSection(section(), INDEX);

    it("links the first occurrence of a record once per section, in reading order, and leaves code untouched", () => {
        expect(linked.intro).toContain("<a href=");
        expect(textOf(linked.blocks?.[0])).toBe("Fail fast here.");
        expect(linked.subsections[0]?.content).toBe("Fail fast again.");
        expect(linked.subsections[0]?.blocks?.[1]).toStrictEqual(section().subsections[0]?.blocks?.[1]);
    });

    it("links lesson fields and keeps every other field intact", () => {
        const lesson = lessonOf(linked.subsections[0]?.blocks?.[0]);
        expect(lesson?.cause).toContain('<a href="/ontology#architecture-high-cohesion">High cohesion</a>');
        expect(lesson?.principle).toBe("High cohesion holds.");
        expect(lesson?.decision).toBe("Decide.");
    });
});

describe("linkTabs", () => {
    it("links every section of every tab with its own scope", () => {
        const tabs: readonly Tab[] = [
            { icon: "i", id: "one", label: "One", sections: [section(), { ...section(), id: "b" }] },
        ];
        const [tab] = linkTabs(tabs, VOCABULARY);
        expect(tab?.sections.every((held) => held.intro?.includes("<a href=") === true)).toBe(true);
    });

    it("links a chapter of another page by its title, never a section to itself", () => {
        const own: Section = { ...section(), id: "the-loop", intro: "The loop and fail fast.", title: "The loop" };
        const other: Section = { ...section(), id: "elsewhere", intro: "The loop again.", title: "Elsewhere" };
        const tabs: readonly Tab[] = [{ icon: "i", id: "one", label: "One", sections: [own, other] }];
        const [tab] = linkTabs(tabs, [...VOCABULARY, ...chapterVocabulary([{ page: "a-page", tabs }])], "a-page");
        expect(tab?.sections[0]?.intro).toBe('The loop and <a href="/ontology#architecture-fail-fast">fail fast</a>.');
        expect(tab?.sections[1]?.intro).toBe('<a href="/a-page#the-loop">The loop</a> again.');
    });
});

describe("linkPages", () => {
    it("links each baked page with the ontology vocabulary and the chapter titles of every page, keeping its own fields", () => {
        const own: Section = { ...section(), id: "the-loop", intro: "The loop and fail fast.", title: "The loop" };
        const reader: Section = { ...section(), id: "reader", intro: "See the loop.", title: "Reader" };
        const baked: LinkedPage = {
            name: "B_TABS",
            page: "b-page",
            stem: "b.page",
            tabs: [{ icon: "i", id: "two", label: "Two", sections: [reader] }],
        };
        const pages = [{ page: "a-page", tabs: [{ icon: "i", id: "one", label: "One", sections: [own] }] }, baked];
        const [linked] = linkPages(pages, [baked], VOCABULARY);
        expect(linked?.name).toBe("B_TABS");
        expect(linked?.stem).toBe("b.page");
        expect(linked?.tabs[0]?.sections[0]?.intro).toBe('See <a href="/a-page#the-loop">the loop</a>.');
    });
});

describe("stageLink, layerLink and nodeLink", () => {
    it("link a loop stage, a reasoning layer and a reasoning node to their records on the ontology page", () => {
        expect(stageLink("orient")).toBe('<a href="/ontology/reasoning#stage-orient">orient</a>');
        expect(layerLink("epistemic", "the epistemic layer")).toBe(
            '<a href="/ontology/reasoning#reasoning-layer-epistemic">the epistemic layer</a>',
        );
        expect(nodeLink("tel-priority", "priority")).toBe(
            '<a href="/ontology/reasoning#reasoning-node-tel-priority">priority</a>',
        );
    });
});

describe("chapterRef and chapterVocabulary", () => {
    const tabs: readonly Tab[] = [
        { icon: "i", id: "first", label: "First", sections: [{ ...section(), id: "one", title: "One thing" }] },
        { icon: "i", id: "second", label: "Second", sections: [{ ...section(), id: "two", title: "Two things" }] },
    ];

    it("addresses a section on the page path for the first tab and on the tab path otherwise", () => {
        expect(chapterRef("a-page", tabs, "first", "one")).toBe("chapter:/a-page#one");
        expect(chapterRef("a-page", tabs, "second", "two")).toBe("chapter:/a-page/second#two");
    });

    it("yields one prose entry per section, titled by the section", () => {
        expect(chapterVocabulary([{ page: "a-page", tabs }])).toStrictEqual([
            { code: null, kind: "chapter", layer: null, phrase: "One thing", prose: true, ref: "chapter:/a-page#one" },
            {
                code: null,
                kind: "chapter",
                layer: null,
                phrase: "Two things",
                prose: true,
                ref: "chapter:/a-page/second#two",
            },
        ]);
    });
});

describe("joinGlossary and entryFor", () => {
    it("joins a term to its record, deriving kind and code, keeping an authored placement over the record's layer, and a placed term to its layer", () => {
        const [srp, owner, stray, yagni] = joinGlossary(
            [
                { description: "d", term: "Single Responsibility Principle" },
                { description: "d", domains: [RESOURCE], term: "Single Owner" },
                { description: "d", term: "Nothing Known" },
                { description: "d", domains: [RESOURCE], term: "YAGNI" },
            ],
            VOCABULARY,
        );
        expect(srp).toStrictEqual({
            code: "SRP",
            description: "d",
            domains: ["principle", STRUCTURAL],
            href: "/ontology#architecture-single-responsibility",
            term: "Single Responsibility Principle",
        });
        expect(owner?.href).toBe("/ontology/schema#layer-resource-core");
        expect(owner?.domains).toStrictEqual([RESOURCE]);
        expect(stray?.href).toBeUndefined();
        expect(yagni?.href).toBe("/ontology/lexicon#lexicon-yagni");
        expect(yagni?.domains).toStrictEqual(["principle", RESOURCE]);
        expect(entryFor("high cohesion", INDEX)?.ref).toBe("architecture:high-cohesion");
        expect(entryFor("cohesion", INDEX)).toBeNull();
    });

    it("drops a derived code that only repeats the term", () => {
        const [cqrs] = joinGlossary(
            [{ description: "d", term: "CQRS" }],
            [
                {
                    code: "CQRS",
                    kind: "pattern",
                    layer: "Execution Core",
                    phrase: "CQRS",
                    prose: true,
                    ref: "architecture:cqrs",
                },
            ],
        );
        expect(cqrs?.code).toBeUndefined();
        expect(cqrs?.domains).toStrictEqual(["pattern", "Execution Core"]);
    });

    it("never links a glossary entry's description to the entry's own record", () => {
        const glossary: Section = {
            blocks: [
                {
                    entries: [
                        {
                            description: "Fail fast is its own thing; high cohesion helps.",
                            href: "/ontology#architecture-fail-fast",
                            term: "Fail Fast",
                        },
                        { description: "High cohesion again, and fail fast again.", term: "High Cohesion" },
                    ],
                    kind: "glossary",
                },
            ],
            icon: "icon",
            id: "glossary",
            subsections: [],
            title: "Glossary",
        };
        const [block] = linkSection(glossary, INDEX).blocks ?? [];
        const entries = block?.kind === "glossary" ? block.entries : [];
        expect(entries[0]?.description).toBe(
            'Fail fast is its own thing; <a href="/ontology#architecture-high-cohesion">high cohesion</a> helps.',
        );
        expect(entries[1]?.description).toBe("High cohesion again, and fail fast again.");
    });
});
