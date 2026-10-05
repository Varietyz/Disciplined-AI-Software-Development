import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";
import { analyzabilityMessages } from "@govlab/docs/core/validators/barrel.validator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const made: string[] = [];

const moduleWithManifest = function moduleWithManifest(manifest: Record<string, unknown>): ManifestModule {
    const dir = mkdtempSync(join(tmpdir(), "docbarrel-"));
    made.push(dir);
    writeVerbatim(join(dir, "_manifest.json"), JSON.stringify(manifest));
    return { dir, group: "test", label: "mod", manifest, pkg: {}, relPath: "test/mod", slug: "mod" };
};

afterEach(() => {
    for (const dir of made.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("analyzabilityMessages", () => {
    it("reports a documented module that declares no entries and resolves no barrel", () => {
        expect(analyzabilityMessages(moduleWithManifest({ docs: {} }), false)).toStrictEqual([
            expect.stringContaining("entry-undeclared"),
        ]);
    });

    it("reports a declared pattern that matches nothing, also on an aggregate", () => {
        const module = moduleWithManifest({ docs: {}, entries: ["src/*.missing.ts"] });
        expect(analyzabilityMessages(module, false)).toStrictEqual([expect.stringContaining("entry-unresolved")]);
        expect(analyzabilityMessages(module, true)).toStrictEqual([expect.stringContaining("entry-unresolved")]);
    });

    it("stays quiet for an explicitly empty entries declaration", () => {
        expect(analyzabilityMessages(moduleWithManifest({ docs: {}, entries: [] }), false)).toStrictEqual([]);
    });
});
