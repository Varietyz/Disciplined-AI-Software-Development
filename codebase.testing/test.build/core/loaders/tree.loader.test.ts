import { CONFIG_TAB, COORDINATION_TAB, GOVERNANCE_TAB, TREE_TAB } from "@banes-lab/web/ids/anatomy.ids";
import { describe, expect, it } from "vitest";
import { ROOT } from "@ssot/paths";
import {
    publishedPaths,
    readDeclaredTree,
    treeDeclarations,
} from "@banes-lab/build-scripts/core/loaders/tree.loader.ts";
import { workspaceMembers } from "@govlab/docs";

describe("treeDeclarations", () => {
    const declarations = treeDeclarations();
    const tabs = declarations.map((declaration) => declaration.tab);

    it("puts the site tree first and the configs last, with one tab per tree", () => {
        expect(tabs[0]).toBe(TREE_TAB);
        expect(tabs.at(-1)).toBe(CONFIG_TAB);
        expect(new Set(tabs).size).toBe(tabs.length);
        expect(tabs).toContain(GOVERNANCE_TAB);
        expect(tabs).toContain(COORDINATION_TAB);
        expect(tabs).toContain("content");
        expect(tabs).not.toContain("build");
    });

    it("declares every workspace member that carries a manifest label", () => {
        const folders = new Set(declarations.map((declaration) => declaration.folder));
        expect(workspaceMembers(ROOT).filter((folder) => !folders.has(folder))).toStrictEqual([]);
    });

    it("carries each member's package name and its plain-string exports", () => {
        const docs = declarations.find((declaration) => declaration.packageName === "@govlab/docs");
        expect(docs?.exports.length).toBeGreaterThan(0);
        expect(declarations.find((declaration) => declaration.tab === CONFIG_TAB)?.packageName).toBeNull();
    });

    it("gives every tree that publishes to the methodology repository the license its member declares", () => {
        const published = declarations.filter((declaration) => declaration.repository !== null);
        expect(published.length).toBeGreaterThan(0);
        expect(published.filter((declaration) => declaration.license === null)).toStrictEqual([]);
    });

    it("reads a declared tree from disk and publishes only its linked files", () => {
        const coordination = declarations.find((declaration) => declaration.tab === COORDINATION_TAB);
        if (coordination === undefined) {
            throw new Error(COORDINATION_TAB);
        }
        const tree = readDeclaredTree(coordination, () => false);
        expect(tree.files.some((file) => file.name === "package.json")).toBe(true);
        const published = publishedPaths(coordination, () => false);
        expect(published).toContain("package.json");
        expect(published.every((path) => !path.includes(".generated."))).toBe(true);
    });

    it("gives each tree a label and an export name, and only configs publishes generated sources", () => {
        expect(declarations.every((declaration) => declaration.label.length > 0)).toBe(true);
        expect(declarations.find((declaration) => declaration.tab === TREE_TAB)?.exportName).toBe("ANATOMY");
        expect(
            declarations.filter((declaration) => declaration.generatedSources).map((item) => item.tab),
        ).toStrictEqual([CONFIG_TAB]);
    });
});
