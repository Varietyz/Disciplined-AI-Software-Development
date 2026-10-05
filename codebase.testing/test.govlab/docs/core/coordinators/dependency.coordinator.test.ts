import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";
import { join } from "node:path";
import { mermaidHardening } from "@govlab/docs/core/analyzers/diagram.analyzer.ts";
import { renderRenderable } from "@govlab/docs/core/formatters/markdown.formatter.ts";
import { tmpdir } from "node:os";
import { workspaceMapTargetFor } from "@govlab/docs/core/coordinators/dependency.coordinator.ts";

const root = mkdtempSync(join(tmpdir(), "doc-map-"));
const MODULE: ManifestModule = {
    dir: "a",
    group: "utils",
    label: "a",
    manifest: { maturity: "stable" },
    pkg: { dependencies: { "@govlab/b": "*" }, name: "@govlab/a" },
    relPath: "a",
    slug: "a",
};

const targetWith = function targetWith(modules: ManifestModule[]): ReturnType<typeof workspaceMapTargetFor> {
    return workspaceMapTargetFor({
        declaredDocLocation: () => "docs/map.md",
        discoverAll: () => modules,
        formatMarkdown: async (markdown: string) => {
            await Promise.resolve();
            return markdown;
        },
        renderDeclaredDoc: (doc) =>
            doc.body.map((section) => `## ${section.heading}\n\n${renderRenderable(section.content)}`).join("\n\n"),
        root,
    });
};

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("workspaceMapTargetFor", () => {
    it("renders a hardened map at its computed location, and nothing for an empty workspace", async () => {
        const map = await targetWith([MODULE])();
        expect(map?.path).toBe(join(root, "docs", "map.md"));
        expect(map?.content).toContain("| `@govlab/a` | utils | stable | 1 |");
        expect(mermaidHardening(map?.content ?? "")).toStrictEqual([]);
        expect(await targetWith([])()).toBeNull();
    });
});
