import { describe, expect, it } from "vitest";
import { LINK } from "./link.fixture.ts";
import { renderSourceLeaf } from "@banes-lab/build-scripts/core/formatters/source.formatter.ts";

describe("renderSourceLeaf", () => {
    it("renders a source file with its definitions, its text and its place in its folder", () => {
        const source = renderSourceLeaf(
            {
                definitions: [{ exported: true, kind: "function", line: 3, name: "run" }],
                href: null,
                language: "ts",
                layer: null,
                path: "core/a.ts",
                relations: [{ links: [LINK], relation: "enforces" }],
                siblings: { next: LINK, previous: null },
                summary: null,
                text: null,
                up: { ...LINK, label: "Build" },
            },
            "Build",
            "code",
        );
        expect(source).toContain("`run` (function, line 3, exported)");
        expect(source).toContain("```ts\ncode\n```");
        expect(source).toContain("## Enforces");
        expect(source).toContain("Listed in [Build](https://x.test/a.md), before [A](https://x.test/a.md).");
    });
});
