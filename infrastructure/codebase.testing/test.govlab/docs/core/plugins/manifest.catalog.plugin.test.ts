import { describe, expect, it } from "vitest";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";
import { plugin } from "@govlab/docs/core/plugins/manifest.catalog.plugin.ts";

const MODULE: ManifestModule = {
    dir: "",
    ecosystemHint: "go",
    group: "x",
    label: "x",
    manifest: {},
    pkg: {},
    relPath: "x",
    slug: "x",
};

describe("the catalog manifest plugin", () => {
    it("writes the spine, the transitive requirements, the relationships and the ecosystem", () => {
        const entry = { category: null, value: "x" };
        const manifest = {
            ecosystem: "typescript",
            label: "X",
            maturity: "stable",
            overlaps: [{ package: "@govlab/other", reason: "shares a job" }],
            summary: "y",
        };
        plugin.contribute?.(manifest, entry, { module: MODULE, requires: () => ["a", "b"] });
        expect(entry).toMatchObject({
            ecosystem: "typescript",
            label: "X",
            maturity: "stable",
            overlaps: [{ package: "other", reason: "shares a job" }],
            requires: ["a", "b"],
        });
    });

    it("falls back to the slug and the detected ecosystem", () => {
        const entry = { category: null, value: "x" };
        plugin.contribute?.({}, entry, { module: MODULE, requires: () => [] });
        expect(entry).toMatchObject({ ecosystem: "go", label: "x" });
    });
});
