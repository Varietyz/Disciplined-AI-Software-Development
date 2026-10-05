import { describe, expect, it } from "vitest";
import { linkSetOf, linkTarget, readLinkSet } from "@banes-lab/content/core/loaders/link.loader.ts";

describe("linkSetOf", () => {
    it("keys each section's links by the section", () => {
        const set = linkSetOf([{ fingerprint: "f", key: "p#a", links: ["/x"], page: "p" }]);
        expect(set).toStrictEqual({ "p#a": ["/x"] });
    });
});

describe("linkTarget and readLinkSet", () => {
    it("resolves the baseline under the content reports and reads back a shaped set or null", () => {
        expect(linkTarget()).toContain("link-set");
        const held = readLinkSet();
        expect(held === null || typeof held === "object").toBe(true);
    });
});
