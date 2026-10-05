import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { BEHAVIOR_TREE_PLACEHOLDER } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { loadTaxonomy } from "coordination-surface/tools/core/resolvers/taxonomy.resolver.ts";
import { placeholderFindings } from "coordination-surface/tools/core/inspectors/declaration.inspector.ts";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";

type Context = Parameters<typeof placeholderFindings>[0];

const SOURCES: Record<string, string> = {
    "a.md": `see ${BEHAVIOR_TREE_PLACEHOLDER}/rules`,
    "b.md": "adopted",
    "c.txt": BEHAVIOR_TREE_PLACEHOLDER,
};

describe("placeholderFindings", () => {
    it("names a document that still cites the placeholder folder once it is renamed, and nothing while it stands", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-placeholder-"));
        try {
            const context: Context = {
                exists: () => false,
                id: "declaration",
                paths: Object.keys(SOURCES),
                read: (path: string) => SOURCES[path] ?? "",
                repoRoot,
                taxonomy: loadTaxonomy(),
            };
            assert.deepEqual(
                placeholderFindings(context).map((finding) => finding.path),
                ["a.md"],
            );
            mkdirSync(resolve(repoRoot, surfacePrefix(), BEHAVIOR_TREE_PLACEHOLDER), { recursive: true });
            assert.deepEqual(placeholderFindings(context), []);
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
