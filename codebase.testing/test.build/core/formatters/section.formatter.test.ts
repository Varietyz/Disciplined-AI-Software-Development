import { describe, expect, it } from "vitest";
import { renderSectionLeaf, renderSectionPart } from "@banes-lab/build-scripts/core/formatters/section.formatter.ts";
import { LINK } from "./link.fixture.ts";

describe("renderSectionPart", () => {
    it("names the part, links its whole section and its own JSON, and lists the subsections it holds", () => {
        const part = renderSectionPart(
            "Big, part 1 of 2",
            "https://x.test/json/m/s/big/_1",
            "https://x.test/m/s/big.md",
            ["First", "Second"],
        );
        expect(part).toContain("# Big, part 1 of 2");
        expect(part).toContain("https://x.test/m/s/big.md");
        expect(part).toContain("https://x.test/json/m/s/big/_1");
        expect(part).toContain("First");
        expect(part).toContain("Second");
    });
});

describe("renderSectionLeaf", () => {
    it("renders a section with its page, its place in the route and its place in its index", () => {
        const section = renderSectionLeaf(
            {
                href: "https://x.test/p#s",
                relations: [{ links: [LINK], relation: "links-to" }],
                route: { next: LINK, position: 2, previous: null, requires: [LINK], total: 9 },
                siblings: { next: null, previous: LINK },
                summary: "S.",
                title: "S",
                up: { ...LINK, label: "Tab", markdown: "https://x.test/api/pages/p/t.md" },
            },
            "Page",
            "Tab",
            "Body.",
        );
        expect(section).toContain("Page: Page · Tab");
        expect(section).toContain(
            "This section is stop 2 of 9 in the learning route, before [A](https://x.test/a.md). It builds on [A](https://x.test/a.md).",
        );
        expect(section).toContain("Listed in [Tab](https://x.test/api/pages/p/t.md), after [A](https://x.test/a.md).");
        expect(section).toContain("## Links to");
    });
});
