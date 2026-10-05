import { blockingGaps, coverageRow, renderCoverage } from "@govlab/docs/core/formatters/coverage.formatter.ts";
import { describe, expect, it } from "vitest";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";

const moduleOf = function moduleOf(label: string, manifest: Record<string, unknown>): ManifestModule {
    return { dir: label, group: "g", label, manifest, pkg: {}, relPath: label, slug: label };
};

const COMPLETE = moduleOf("complete", { capabilities: ["x"], docs: { aiContext: "a" }, overlaps: [{}] });
const BARE = moduleOf("bare", {});
const PRIVATE = moduleOf("private", { capabilities: ["x"], visibility: { private: true } });

describe("coverageRow", () => {
    it("lists the enrichment gaps of a module, sparing a private module the AI context", () => {
        expect(coverageRow(COMPLETE).gaps).toStrictEqual([]);
        expect(coverageRow(BARE).gaps).toStrictEqual(["no-capabilities", "no-ai-context", "no-relationships"]);
        expect(coverageRow(PRIVATE)).toStrictEqual({ gaps: ["no-relationships"], isPrivate: true, slug: "private" });
    });
});

describe("blockingGaps and renderCoverage", () => {
    it("count only the blocking gaps and rank the modules with the most gaps first", () => {
        const rows = [COMPLETE, BARE, PRIVATE].map(coverageRow);
        expect(blockingGaps(rows)).toBe(2);
        const lines = renderCoverage(rows);
        expect(lines[0]).toContain("3 modules");
        expect(lines.slice(4, 6)).toStrictEqual([
            "  bare — no-capabilities, no-ai-context, no-relationships",
            "  private [private] — no-relationships",
        ]);
        expect(lines.at(-1)).toContain("2 enrichment gap(s)");
        expect(renderCoverage([coverageRow(COMPLETE)]).at(-1)).toContain("complete");
    });
});
