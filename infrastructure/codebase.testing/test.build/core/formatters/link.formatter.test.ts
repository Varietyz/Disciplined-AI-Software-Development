import { BARE, LINK } from "./link.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    linkList,
    linkSection,
    linkText,
    placementLine,
    relationSections,
} from "@banes-lab/build-scripts/core/formatters/link.formatter.ts";

describe("relationSections", () => {
    it("writes one titled list per relation that has links, and nothing for one that has none", () => {
        const [held, empty] = relationSections([
            { links: [LINK], relation: "links-to" },
            { links: [], relation: "linked-from" },
        ]);
        expect(held).toContain("## Links to");
        expect(held).toContain("[A](https://x.test/a.md)");
        expect(empty).toBeNull();
    });
});

describe("linkText, linkList and linkSection", () => {
    it("prefers the Markdown leaf, then the JSON leaf, then the page, and prints a bare label otherwise", () => {
        expect(linkText(LINK)).toBe("[A](https://x.test/a.md)");
        expect(linkText({ ...LINK, markdown: null })).toBe("[A](https://x.test/json/a)");
        expect(linkText(BARE)).toBe("Bare");
        expect(linkList([LINK, BARE])).toBe("[A](https://x.test/a.md), Bare");
        expect(linkSection("Links", [])).toBeNull();
    });
});

describe("placementLine", () => {
    it("places a leaf in its index with the neighbors it has, and writes nothing without an index", () => {
        expect(placementLine({ siblings: { next: LINK, previous: BARE }, up: LINK })).toBe(
            "Listed in [A](https://x.test/a.md), after Bare and before [A](https://x.test/a.md).",
        );
        expect(placementLine({ siblings: null, up: LINK })).toBe("Listed in [A](https://x.test/a.md).");
        expect(placementLine({ siblings: null, up: null })).toBeNull();
    });
});
