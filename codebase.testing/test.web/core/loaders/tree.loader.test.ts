import { TREE_TAB_HEADS, loadTreeTab, loadTreeTabs } from "@banes-lab/web/core/loaders/tree.loader.ts";
import { describe, expect, it } from "vitest";
import { ANATOMY_TREE_DECLARATIONS } from "@banes-lab/web/core/registries/anatomy.tree.registry.ts";

describe("TREE_TAB_HEADS", () => {
    it("gives every declared tree a tab head with its label and no sections yet", () => {
        expect(TREE_TAB_HEADS.map((head) => head.id)).toStrictEqual(
            ANATOMY_TREE_DECLARATIONS.map((declaration) => declaration.tab),
        );
        expect(TREE_TAB_HEADS.every((head) => head.sections.length === 0 && head.layout === "tree")).toBe(true);
    });
});

describe("loadTreeTab and loadTreeTabs", () => {
    it("loads a baked tree tab by its id and answers undefined for a tree with no baked module", async () => {
        expect(await loadTreeTab("undeclared")).toBeUndefined();
        const tabs = await loadTreeTabs();
        expect(tabs.every((tab) => TREE_TAB_HEADS.some((head) => head.id === tab.id))).toBe(true);
    });
});
