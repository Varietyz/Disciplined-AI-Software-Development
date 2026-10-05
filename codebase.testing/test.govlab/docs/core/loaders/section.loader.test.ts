import { describe, expect, it } from "vitest";
import { loadPlugins, loadUserManifestPlugins } from "@govlab/docs/core/loaders/section.loader.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { EXTENSION_DIR } from "@govlab/docs/core/loaders/registry.loader.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("loadPlugins", () => {
    it("discovers the shipped manifest plugins, sorted by name", async () => {
        const names = (await loadPlugins()).map((plugin) => plugin.name);
        expect(names.length).toBeGreaterThan(0);
        expect(names).toStrictEqual(names.toSorted((left, right) => left.localeCompare(right)));
    });
});

describe("loadUserManifestPlugins", () => {
    it("loads a user plugin from the extension folder and nothing when the folder is absent", async () => {
        const root = mkdtempSync(join(tmpdir(), "doclab-plugins-"));
        try {
            expect(await loadUserManifestPlugins(root)).toStrictEqual([]);
            const dir = join(root, EXTENSION_DIR, "manifest-plugins");
            mkdirSync(dir, { recursive: true });
            writeVerbatim(
                join(dir, "extra.plugin.mjs"),
                'export const plugin = { name: "extra", section: { keys: ["extraField"], validate: () => [] } };',
            );
            const plugins = await loadUserManifestPlugins(root);
            expect(plugins.map((plugin) => plugin.name)).toStrictEqual(["extra"]);
            expect(plugins[0]?.section?.keys).toStrictEqual(["extraField"]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
