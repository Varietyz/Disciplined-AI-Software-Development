import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { renameMapOf, rewriteReferences } from "coordination-surface/tools/core/transformers/reference.transformer.ts";
import { SURFACE_ROOT } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("renameMapOf", () => {
    it("maps each move and its local: form", () => {
        assert.deepEqual(renameMapOf([{ from: "a.md", to: "b.md" }]), { "a.md": "b.md", "local:a.md": "local:b.md" });
    });
});

describe("rewriteReferences", () => {
    it("rewrites every reference to a moved file across the surface's documents, and counts the edits", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-references-"));
        try {
            const surface = resolve(root, SURFACE_ROOT);
            mkdirSync(surface, { recursive: true });
            const document = join(surface, "notes.md");
            writeVerbatim(document, "see [the old](old.md) and `old.md`\n");
            const count = rewriteReferences(root, renameMapOf([{ from: "old.md", to: "new.md" }]));
            assert.equal(count, 2);
            assert.equal(readFileSync(document, "utf8"), "see [the old](new.md) and `new.md`\n");
            assert.equal(rewriteReferences(root, { "absent.md": "x.md" }), 0);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
