import { describe, expect, it } from "vitest";
import { GENERATED_MARK_PREFIX } from "@govlab/canonical-write";
import { INPUT } from "../loaders/stats.fixture.ts";
import { renderReport } from "@govlab/stats/core/reporters/report.reporter.ts";

describe("renderReport", () => {
    const markdown = renderReport(INPUT);

    it("opens with frontmatter, so the document validator can read its axes", () => {
        expect(markdown.startsWith("---\n")).toBe(true);
        expect(markdown).toContain("name: codebase-stats");
    });

    it("leaves the generated mark to the writer, so an unchanged census keeps its time and version", () => {
        expect(markdown).not.toContain(GENERATED_MARK_PREFIX);
    });

    it("renders every section in order", () => {
        const order = [
            "## I. Existence",
            "## II. Arrangement",
            "## III. Dynamics",
            "## IV. Interaction",
            "## V. Abstraction",
        ];
        const positions = order.map((heading) => markdown.indexOf(heading));
        expect(positions.every((at) => at >= 0)).toBe(true);
        expect(positions).toStrictEqual(positions.toSorted((a, b) => a - b));
    });
});
