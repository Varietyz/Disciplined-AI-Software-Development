import { CALLEE_FILE, CONTAINER, sourceFile } from "./anatomy.fixture.ts";
import { describe, expect, it } from "vitest";
import type { DiskFile } from "@banes-lab/build-scripts/types/structure.types.ts";
import { importEdgesOf } from "@banes-lab/build-scripts/core/converters/specifier.converter.ts";
import { specifierResolverOf } from "@banes-lab/web/core/converters/definition.converter.ts";

const ASSETS_FILE = ["core", "assets", "link.assets.ts"].join("/");

const fileAt = function fileAt(path: string, text: string): DiskFile {
    return { ...sourceFile(), path, text };
};

describe("importEdgesOf", () => {
    it("folds container imports to container edges", async () => {
        const edges = await importEdgesOf([sourceFile(), fileAt(CALLEE_FILE, "")], specifierResolverOf);
        expect(edges).toStrictEqual([{ count: 1, from: CONTAINER, to: "core" }]);
    });

    it("files an aliased import under the container its file lives in, and drops one that resolves to no file", async () => {
        const importer = fileAt(
            `${CONTAINER}/renderers/link.renderer.ts`,
            'import { a } from "#core/assets/link.assets";\nimport { b } from "#nowhere/missing";\nexport const c = a;\n',
        );
        const edges = await importEdgesOf(
            [importer, fileAt(ASSETS_FILE, "export const a = 1;\n")],
            specifierResolverOf,
        );
        expect(edges).toStrictEqual([{ count: 1, from: CONTAINER, to: "core" }]);
    });
});

describe("specifierResolverOf across trees", () => {
    it("resolves a package specifier through the owning tree's exports, a .js specifier to its .ts source", () => {
        const target = "governance~shared/manifests/taxonomy.manifest.ts";
        const resolve = specifierResolverOf(new Set([target, "web.ts"]));
        expect(resolve("@ssot/govlab/shared/manifests/taxonomy.manifest.ts", "web.ts")).toBe(target);
        expect(resolve("@ssot/govlab/shared/manifests/taxonomy.manifest.js", "web.ts")).toBe(target);
        expect(resolve("@ssot/govlab/shared/manifests/missing.ts", "web.ts")).toBeNull();
        expect(resolve("vitest", "web.ts")).toBeNull();
    });
});
