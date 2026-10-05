import { describe, expect, it } from "vitest";
import { docNodeOf } from "@govlab/docs/core/converters/document.converter.ts";
import { renderConcernBarrel } from "@govlab/docs/core/formatters/catalog.formatter.ts";

describe("renderConcernBarrel", () => {
    it("groups entries under one heading per form and marks a superseded entry", () => {
        const nodes = [
            docNodeOf("docs/references/b.md", { name: "b", summary: "B", type: "reference" }),
            docNodeOf("docs/guides/a.md", { name: "a", summary: "A", type: "guide" }),
            docNodeOf("docs/guides/c.md", { name: "c", summary: "C", type: "guide" }),
        ];
        const barrel = renderConcernBarrel("scaling", nodes, { rootPrefix: "docs/", superseded: new Set(["c"]) });
        expect(barrel.split("\n")).toStrictEqual([
            "# Scaling — doc-arch index",
            "",
            "",
            "## Guide",
            "",
            "- [`a`](../guides/a.md) — A",
            "- [`c`](../guides/c.md) — C _(superseded)_",
            "",
            "## Reference",
            "",
            "- [`b`](../references/b.md) — B",
            "",
        ]);
    });
});
