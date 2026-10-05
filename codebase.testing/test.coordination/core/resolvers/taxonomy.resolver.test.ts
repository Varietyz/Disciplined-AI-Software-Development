import { describe, it } from "vitest";
import { governedPath, loadTaxonomy, rootOf } from "coordination-surface/tools/core/resolvers/taxonomy.resolver.ts";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { taxonomy } from "coordination-surface/config/taxonomy.config.ts";

const within = function within(path: string): string {
    return surfacePrefix().length === 0 ? path : `${surfacePrefix()}/${path}`;
};

describe("loadTaxonomy", () => {
    it("derives the folder, tag and layer tables, and places every declared root under the surface's own prefix", () => {
        const data = loadTaxonomy();
        const [first] = taxonomy.concerns;
        assert.equal(data.concernFolders.length, taxonomy.concerns.length);
        assert.equal(data.folderToTag[first.folder], first.tag);
        assert.equal(data.folderToLayer[first.folder], first.layer);
        assert.deepEqual(Object.keys(data.containers).sort(), Object.keys(taxonomy.containers).map(within).sort());
    });
});

describe("rootOf and governedPath", () => {
    it("name the longest declared root holding a path, and the folders between it and the file", () => {
        const data = loadTaxonomy();
        const file = within("tools/core/runners/a.runner.ts");
        assert.equal(rootOf(file, data), within("tools"));
        assert.deepEqual(governedPath(file, data), { root: within("tools"), segments: ["core", "runners"] });
        assert.deepEqual(governedPath(within("tools/a.ts"), data), { root: within("tools"), segments: [] });
        const bare = { ...data, containers: {}, specialContainers: {} };
        assert.equal(rootOf("nowhere/a.ts", bare), null);
        assert.equal(governedPath("nowhere/a.ts", bare), null);
    });
});
