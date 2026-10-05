import { describe, expect, it } from "vitest";
import type { LinkResolver } from "@banes-lab/content/types/chapter.types.ts";
import { relinked } from "@banes-lab/content/core/normalizers/link.normalizer.ts";

const resolve: LinkResolver = (page, tab) =>
    page === "method" ? (tab === null ? "README.md" : `${tab.toUpperCase()}.md`) : null;

describe("relinked", () => {
    it("rewrites every root-relative link through the resolver, keeping the fragment, and sends the rest to the site", () => {
        const text =
            "See [a](/method#top), [b](/method/plan#gate) and [c](/ontology/reasoning#x); [d](#local) and [e](https://x.y/) stay.";
        expect(relinked(text, resolve)).toBe(
            "See [a](README.md#top), [b](PLAN.md#gate) and [c](https://banes-lab.com/ontology/reasoning#x); [d](#local) and [e](https://x.y/) stay.",
        );
    });

    it("leaves a fenced block alone", () => {
        const text = "[a](/method)\n```text\n[b](/method)\n```\n[c](/method)";
        expect(relinked(text, resolve)).toBe("[a](README.md)\n```text\n[b](/method)\n```\n[c](README.md)");
    });
});
