import { describe, expect, it } from "vitest";
import { packageFileOf, packageTargetOf } from "@banes-lab/web/core/resolvers/specifier.resolver.ts";
import { ANATOMY_TREE_DECLARATIONS } from "@banes-lab/web/core/registries/anatomy.tree.registry.ts";
import { qualifiedPath } from "@banes-lab/web/core/converters/folder.converter.ts";

const DOCS = ANATOMY_TREE_DECLARATIONS.find((declaration) => declaration.packageName === "@govlab/docs");
const MAIN = DOCS?.exports.find((entry) => entry.key === ".");
const RELATIVE = "./";

describe("packageTargetOf", () => {
    it("maps a package specifier through the owning package's exports to a path in its tree", () => {
        const main = MAIN?.target.slice(RELATIVE.length) ?? "";
        expect(main.length).toBeGreaterThan(0);
        expect(packageTargetOf("@govlab/docs", ANATOMY_TREE_DECLARATIONS)).toStrictEqual([{ path: main, tab: "docs" }]);
    });

    it("finds no target for a package no tree declares, or a name that only shares a prefix", () => {
        expect(packageTargetOf("vitest", ANATOMY_TREE_DECLARATIONS)).toStrictEqual([]);
        expect(packageTargetOf("@govlab/docs-extra", ANATOMY_TREE_DECLARATIONS)).toStrictEqual([]);
    });
});

describe("packageFileOf", () => {
    it("returns the first target that exists, trying a .js specifier's .ts source", () => {
        const main = qualifiedPath("docs", MAIN?.target.slice(RELATIVE.length) ?? "");
        expect(packageFileOf("@govlab/docs", (path) => (path === main ? path : null))).toBe(main);
        expect(packageFileOf("@govlab/docs", () => null)).toBeNull();
        expect(packageFileOf("vitest", (path) => path)).toBeNull();
    });
});
