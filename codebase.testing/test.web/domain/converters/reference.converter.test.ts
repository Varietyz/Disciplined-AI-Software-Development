import {
    chapterOf,
    payloadOfHref,
    plainMarkdown,
    targetOfHref,
} from "@banes-lab/web/domain/converters/reference.converter.ts";
import { describe, expect, it } from "vitest";
import { hrefOf, refOfAnchor } from "@banes-lab/web/domain/converters/ontology.converter.ts";
import { payloadPath } from "@banes-lab/web/core/assets/link.assets.ts";

const PAYLOAD = {
    content: {
        tabs: [
            {
                id: "collaborate",
                sections: [
                    {
                        id: "the-board",
                        intro: "A board holds [what is true](/methodology#x) **now**.",
                        subsections: [
                            {
                                blocks: [
                                    { kind: "text", text: "irrelevant" },
                                    { kind: "lesson", principle: "State is *derived*." },
                                ],
                            },
                        ],
                        title: "The board and the venue",
                    },
                ],
            },
        ],
    },
    id: "methodology",
};

describe("refOfAnchor", () => {
    it("recovers a collection reference from its anchor id, longest anchor first, and null for an unknown anchor", () => {
        expect(refOfAnchor("architecture-fail-fast")).toBe("architecture:fail-fast");
        expect(refOfAnchor("architecture-category-structural")).toBe("architecture-category:structural");
        expect(refOfAnchor("lexicon-category-core")).toBe("lexicon-category:core");
        expect(refOfAnchor("unknown-anchor")).toBeNull();
    });
});

describe("targetOfHref", () => {
    it("recovers the record reference an ontology link was built from", () => {
        expect(targetOfHref(hrefOf("architecture:fail-fast") ?? "")).toStrictEqual({
            face: "architecture",
            ref: "architecture:fail-fast",
        });
        expect(targetOfHref(hrefOf("architecture-category:structural") ?? "")).toStrictEqual({
            face: "architecture-category",
            ref: "architecture-category:structural",
        });
        expect(targetOfHref(hrefOf("layer:structural-core") ?? "")).toStrictEqual({
            face: "layer",
            ref: "layer:structural-core",
        });
        expect(targetOfHref(hrefOf("lexicon:yagni") ?? "")).toStrictEqual({ face: "lexicon", ref: "lexicon:yagni" });
    });

    it("treats any other site link with a fragment as a chapter, and ignores the rest", () => {
        expect(targetOfHref("/methodology/collaborate#the-board")).toStrictEqual({
            face: "chapter",
            ref: "chapter:/methodology/collaborate#the-board",
        });
        expect(targetOfHref("/methodology")).toBeNull();
        expect(targetOfHref("/ontology#unknown-anchor")).toBeNull();
        expect(targetOfHref("https://example.com/#x")).toBeNull();
    });
});

describe("payloadOfHref", () => {
    it("maps a page link to the page payload and a tab link to the tab payload", () => {
        expect(payloadPath("methodology")).toBe("/json/methodology");
        expect(payloadPath("methodology", "collaborate")).toBe("/json/methodology/collaborate");
        expect(payloadOfHref("/methodology#the-board")).toBe(payloadPath("methodology"));
        expect(payloadOfHref("/methodology/collaborate#the-board")).toBe(payloadPath("methodology", "collaborate"));
    });
});

describe("plainMarkdown", () => {
    it("keeps link labels and drops emphasis and code marks", () => {
        expect(plainMarkdown("A [label](/x#y) with **bold** and `code`.")).toBe("A label with bold and code.");
        expect(plainMarkdown("An unclosed [bracket")).toBe("An unclosed [bracket");
    });

    it("reads a cite as its label, and stops the cite at its own bracket rather than at a later link", () => {
        expect(plainMarkdown("Shown in [the model]. See [lost update](/ontology#x).")).toBe(
            "Shown in the model. See lost update.",
        );
    });
});

describe("chapterOf", () => {
    it("finds the section by id inside a page payload or a tab payload and reads its title, intro and principle", () => {
        const chapter = chapterOf(PAYLOAD, "the-board");
        expect(chapter?.title).toBe("The board and the venue");
        expect(chapter?.intro).toBe("A board holds what is true now.");
        expect(chapter?.principle).toBe("State is derived.");
        expect(chapterOf({ content: PAYLOAD.content.tabs[0] }, "the-board")?.title).toBe("The board and the venue");
        expect(chapterOf(PAYLOAD, "missing")).toBeNull();
        expect(chapterOf(null, "the-board")).toBeNull();
    });
});
