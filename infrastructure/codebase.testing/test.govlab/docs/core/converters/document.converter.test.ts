import { describe, expect, it } from "vitest";
import { docNodeOf } from "@govlab/docs/core/converters/document.converter.ts";

describe("docNodeOf", () => {
    it("reads a graph node from frontmatter fields, with its edge lists", () => {
        const node = docNodeOf("docs/guides/a.guide.md", {
            concern: "scaling",
            "depends-on": "[b, c]",
            name: "a",
            status: "current",
            type: "guide",
        });
        expect(node).toMatchObject({
            concern: "scaling",
            dependsOn: ["b", "c"],
            links: [],
            name: "a",
            relPath: "docs/guides/a.guide.md",
        });
        expect(docNodeOf("x.md", {}).name).toBe("");
    });
});
