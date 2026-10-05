import { CONFIG_TAB, TREE_TAB } from "@banes-lab/web/core/ids/anatomy.ids.ts";
import {
    ANATOMY_TREE_DECLARATIONS,
    repositoryOf,
    treeDeclarationOf,
} from "@banes-lab/web/core/registries/anatomy.tree.registry.ts";
import { describe, expect, it } from "vitest";

describe("treeDeclarationOf and repositoryOf", () => {
    it("finds a tree by its tab, and gives the repository folder of a published tree", () => {
        expect(treeDeclarationOf(TREE_TAB)).toBe(ANATOMY_TREE_DECLARATIONS[0]);
        expect(treeDeclarationOf("undeclared")).toBeUndefined();
        expect(repositoryOf(CONFIG_TAB)).toBe(treeDeclarationOf(CONFIG_TAB)?.repository);
    });

    it("refuses the repository of a tree that is not published", () => {
        expect(() => repositoryOf(TREE_TAB)).toThrow(TREE_TAB);
    });
});
