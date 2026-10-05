import { describe, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadTaxonomy } from "coordination-surface/tools/core/resolvers/taxonomy.resolver.ts";
import { resolveScope } from "coordination-surface/tools/core/resolvers/scope.resolver.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

type Taxonomy = Parameters<typeof resolveScope>[1];

const TAXONOMY: Taxonomy = {
    ...loadTaxonomy(),
    artifactRoots: {},
    containers: { src: [] },
    corpusRoots: {},
    ignored: ["skipped.txt"],
    specialContainers: {},
};

describe("resolveScope", () => {
    it("collects the governed files under each naming root, and narrows every set to a scope", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-scope-"));
        try {
            mkdirSync(join(root, "src", "inner"), { recursive: true });
            mkdirSync(join(root, "other"));
            for (const file of ["src/a.txt", "src/inner/b.txt", "src/skipped.txt", "other/c.txt"]) {
                writeVerbatim(join(root, file), "");
            }
            const narrowed = resolveScope(root, TAXONOMY, "src/inner");
            assert.deepEqual(narrowed.all, ["src/inner/b.txt"]);
            assert.deepEqual(narrowed.byJurisdiction.artifact, []);
            const whole = resolveScope(root, TAXONOMY, null);
            assert.deepEqual(whole.byJurisdiction.taxonomy.toSorted(), ["src/a.txt", "src/inner/b.txt"]);
            assert.ok(!whole.all.includes("other/c.txt"));
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
