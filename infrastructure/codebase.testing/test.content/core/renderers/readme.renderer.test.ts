import { ANATOMY_PAGE, FAQ_PAGE, GRAMMAR_PAGE, METHODOLOGY_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import {
    CALLOUT_LEAD,
    CALLOUT_TAIL,
    CHAPTER_SUMMARIES,
    INTRO_TEXT,
    LOOP_LEAD,
    PROBLEM_ITEMS,
    PROBLEM_LEAD,
    STANCE_ITEMS,
    STANCE_LEAD,
    STANCE_TAIL,
    START_LEAD,
    WHY_ITEMS,
    WHY_LEAD,
    WORKS_LEAD,
    WORKS_NOTE,
} from "@banes-lab/content/configuration/strings/readme.strings.ts";
import { LOOP_SECTION_ID, STANCE_SECTION_ID } from "@banes-lab/web/core/ids/methodology.start.ids.ts";
import { PLAN_TAB, START_TAB } from "@banes-lab/web/core/ids/methodology.ids.ts";
import { anchorOf, firstSentenceOf } from "@banes-lab/content/core/normalizers/readme.normalizer.ts";
import { describe, expect, it } from "vitest";
import { readStructuredPage, readmeInputsOf } from "@banes-lab/content/core/loaders/readme.loader.ts";
import type { Attribution } from "@banes-lab/content/types/chapter.types.ts";
import { BADGE_LOGO } from "@banes-lab/web/core/assets/image.assets.ts";
import type { ReadmeInputs } from "@banes-lab/content/types/readme.types.ts";
import { renderChapters } from "@banes-lab/content/core/renderers/chapter.renderer.ts";
import { renderFaq } from "@banes-lab/content/core/renderers/faq.renderer.ts";
import { renderReadme } from "@banes-lab/content/core/renderers/readme.renderer.ts";

const ATTRIBUTION: Attribution = {
    author: "Author",
    copyright: "© 2025 ",
    coveredBy: "Documentation is covered by ",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    work: " - Work",
};

const INPUTS: ReadmeInputs = {
    exhibits: [
        {
            description: "The grammar.",
            page: GRAMMAR_PAGE,
            tabs: [{ id: "introduction", label: "Introduction", sections: [] }],
            title: "PAG",
        },
        { description: "The tree.", page: ANATOMY_PAGE, tabs: [], title: "Anatomy" },
    ],
    faq: {
        description: "Questions.",
        page: FAQ_PAGE,
        tabs: [
            {
                id: FAQ_PAGE,
                label: FAQ_PAGE,
                sections: [
                    {
                        diagram: null,
                        id: "origin",
                        intro: null,
                        lessons: [],
                        subsections: [
                            {
                                content: "Because [the loop](/disciplined-methodology#the-loop) says so.",
                                title: "Why?",
                            },
                        ],
                        title: "Origin",
                    },
                ],
            },
        ],
        title: "FAQ",
    },
    heading: "Disciplined Methodology",
    methodology: {
        description: "The method.",
        page: METHODOLOGY_PAGE,
        tabs: [
            {
                id: START_TAB,
                label: "Start",
                sections: [
                    {
                        diagram: "flowchart TB\n    a --> b",
                        id: LOOP_SECTION_ID,
                        intro: "Every piece of work has the same shape.",
                        lessons: [],
                        subsections: [],
                        title: "The loop",
                    },
                    {
                        diagram: null,
                        id: STANCE_SECTION_ID,
                        intro: "Four sentences carry the stance, as [the four] draws and [the loop](/disciplined-methodology#the-loop) frames. The rest follows.",
                        lessons: [{ principle: "Read before you claim.", problem: "Claims go unread." }],
                        subsections: [],
                        title: "The stance",
                    },
                ],
            },
            { id: PLAN_TAB, label: "Plan", sections: [] },
        ],
        title: "Methodology",
    },
    subtitle: "Constraints and checks",
};

describe("anchorOf and firstSentenceOf", () => {
    it("slugs a heading the way a hosted markdown page anchors it and cuts a text at its first sentence", () => {
        expect(anchorOf("The stance, read whole")).toBe("#the-stance-read-whole");
        expect(firstSentenceOf("Four sentences carry the stance. The rest follows.")).toBe(
            "Four sentences carry the stance.",
        );
        expect(firstSentenceOf("No stop here")).toBe("No stop here");
    });
});

describe("renderReadme", () => {
    const readme = renderReadme(INPUTS, ATTRIBUTION);

    it("keeps the archived shape: centered header, callout, title and pitch, the authored sections, the derived stance, exhibits, reading path, loop and FAQ, attribution", () => {
        expect(readme.startsWith('<div align="center">')).toBe(true);
        expect(readme).toContain(
            `<img src="https://banes-lab.com${BADGE_LOGO}" alt="Disciplined Methodology" width="70" height="70" />`,
        );
        expect(readme).toContain("[Disciplined Methodology](");
        expect(readme).toContain(" is licensed under [CC BY-SA 4.0]");
        expect(readme).toContain(`> ${CALLOUT_LEAD}`);
        expect(readme).toContain(`# Disciplined Methodology\n\n**Constraints and checks**\n\n${INTRO_TEXT}`);
        expect(readme).toContain(`${CALLOUT_TAIL}\n>\n> The grammar.\n>`);
        expect(readme).toContain(`## The problem\n\n${PROBLEM_LEAD}\n\n- ${PROBLEM_ITEMS[0] ?? ""}`);
        expect(readme).toContain(
            `## How this works\n\n${WORKS_LEAD}\n\n${WORKS_NOTE}\n\n### [Start](START.md)\n\n${CHAPTER_SUMMARIES[0]?.summary ?? ""}\n\n### [Plan](PLAN.md)`,
        );
        expect(readme).toContain(
            `## The stance\n\n${STANCE_LEAD}\n\n1. ${STANCE_ITEMS[0] ?? ""}\n2. ${STANCE_ITEMS[1] ?? ""}`,
        );
        expect(readme).toContain(`${STANCE_TAIL}[The stance](START.md#the-stance).`);
        expect(readme).not.toContain("Four sentences carry the stance");
        expect(readme).toContain(`## Why this works\n\n${WHY_LEAD}\n\n- ${WHY_ITEMS[0] ?? ""}`);
        expect(readme).toContain(
            "- [PAG](https://banes-lab.com/pag)\n\n  The grammar.\n    - [Introduction](pag/INTRODUCTION.md)\n- [Anatomy](https://banes-lab.com/anatomy)\n\n  The tree.",
        );
        expect(readme).toContain(`## Getting started\n\n${START_LEAD}\n\n### Setup\n\n1. `);
        expect(readme).toContain("_[Read the anatomy page.](https://banes-lab.com/anatomy)_");
        expect(readme).toContain("1. [Start](START.md)\n2. [Plan](PLAN.md)");
        expect(readme).toContain(`## The loop\n\n${LOOP_LEAD}\n\n\`\`\`mermaid\nflowchart TB\n    a --> b\n\`\`\``);
        expect(readme).toContain(
            "<details>\n<summary>Why?</summary>\n\n---\n\nBecause [the loop](/disciplined-methodology#the-loop) says so.\n\n---\n\n</details>",
        );
        expect(readme).not.toContain("Claims go unread.");
        expect(readme.trimEnd().endsWith("[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)")).toBe(true);
    });

    it("leaves the loop section out when the methodology carries no diagram for it", () => {
        const without: ReadmeInputs = {
            ...INPUTS,
            methodology: {
                ...INPUTS.methodology,
                tabs: INPUTS.methodology.tabs.map((tab) => ({
                    ...tab,
                    sections: tab.sections.map((held) => ({ ...held, diagram: null })),
                })),
            },
        };
        expect(renderReadme(without, ATTRIBUTION)).not.toContain("## The loop");
    });

    it("leads the repository when its inputs are present, the first alternate keeping its own chapter file, with the methodology's links pointed at the chapters", () => {
        const chapters = renderChapters(
            {
                pages: [
                    {
                        label: "Method",
                        page: METHODOLOGY_PAGE,
                        sources: [{ first: true, label: "Start", markdown: "# Start\n", tab: "start" }],
                    },
                ],
                readme: INPUTS,
            },
            ATTRIBUTION,
        );
        expect(chapters.map((chapter) => chapter.file)).toStrictEqual(["README.md", "START.md"]);
        expect(chapters[0]?.body.startsWith('<div align="center">')).toBe(true);
        expect(chapters[0]?.body).toContain("[the loop](START.md#the-loop)");
    });
});

describe("renderFaq", () => {
    it("groups each section's questions under its title as collapsed answers", () => {
        const faq = renderFaq(INPUTS.faq);
        expect(faq.startsWith("## Frequently asked questions\n\n### Origin\n\n<details>")).toBe(true);
    });
});

describe("readStructuredPage and readmeInputsOf", () => {
    it("answer null while no site build is present for a page", () => {
        expect(readStructuredPage("no-such-page")).toBeNull();
        expect(readmeInputsOf() === null || readmeInputsOf()?.methodology.page === METHODOLOGY_PAGE).toBe(true);
    });
});
