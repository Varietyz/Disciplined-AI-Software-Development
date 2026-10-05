import { describe, expect, it } from "vitest";
import { LINK } from "./link.fixture.ts";
import { renderRecordLeaf } from "@banes-lab/build-scripts/core/formatters/record.formatter.ts";

const PRINCIPLE = {
    formedBy: "A writer skips the owner.",
    href: null,
    kind: "anti-pattern",
    layer: null,
    name: "R",
    ref: "architecture:r",
    relations: [{ links: [LINK], relation: "refactored-by" }],
    severity: "mandatory",
    siblings: null,
    summary: null,
    up: null,
};

describe("renderRecordLeaf", () => {
    it("renders a record with how it forms, its severity and one section per relation, and no placement without an index", () => {
        const record = renderRecordLeaf(PRINCIPLE);
        expect(record).not.toContain("Listed in");
        expect(record).toContain("Formed by: A writer skips the owner.");
        expect(record).toContain("Severity: mandatory");
        expect(record).toContain("## Refactored by");
    });
});
