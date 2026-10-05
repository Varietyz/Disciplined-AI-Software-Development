import {
    citedAbsolute,
    contendedCitations,
    markerKey,
} from "coordination-surface/tools/core/validators/claim.validator.ts";
import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("citedAbsolute", () => {
    it("resolves a cited path under the surface first, then under the project root, and answers null when neither holds it", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-claims-"));
        try {
            const surface = resolve(root, surfacePrefix());
            mkdirSync(surface, { recursive: true });
            writeVerbatim(join(surface, "own.md"), "");
            writeVerbatim(join(root, "host.md"), "");
            assert.equal(citedAbsolute(root, "own.md"), join(surface, "own.md"));
            assert.equal(citedAbsolute(root, "host.md"), resolve(root, "host.md"));
            assert.equal(citedAbsolute(root, "missing.md"), null);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("markerKey and contendedCitations", () => {
    it("read an item's key, and name each citation whose file changed after the item stamped it", () => {
        const source = [
            "┌─── AGENT A-1 ─── kind:judgment at:10 to:* cites:a.md@100,b.md@200",
            "┌─── AGENT B-1 ─── kind:artifact at:20 to:* cites:a.md@300",
            "prose cites:a.md@1",
        ].join("\n");
        assert.equal(markerKey(source.split("\n")[0] ?? ""), "A-1");
        assert.equal(markerKey("prose"), "");
        const modified = new Map([
            ["a.md", 250],
            ["b.md", 150],
        ]);
        const result = contendedCitations(source, (path) => modified.get(path) ?? null);
        assert.deepEqual(result.contended, [{ cited: "a.md", key: "A-1", moved: 250, stamped: 100 }]);
        assert.deepEqual(result.fanIn, [
            { citations: 2, cited: "a.md", contended: 1 },
            { citations: 1, cited: "b.md", contended: 0 },
        ]);
    });
});
