import { afterEach, describe, expect, it } from "vitest";
import {
    ancestorsOf,
    flatten,
    isFolder,
    markSelected,
    renderTree,
    treeLink,
    treeNodesOf,
} from "@banes-lab/web/presentation/components/folder.component.ts";
import { ACTIVE_CLASS } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { NODE_ATTRIBUTE } from "@banes-lab/web/configuration/constants/anatomy.constants.ts";
import { ROOT_LABEL } from "@banes-lab/web/configuration/strings/folder.strings.ts";
import type { Section } from "@banes-lab/web/types/document.types.ts";
import { isGenericLabel } from "@banes-lab/web/core/predicates/link.predicate.ts";
import { targetOf } from "@banes-lab/web/core/converters/folder.converter.ts";

const ICON = "bi-folder";
const CORE = "core";
const ASSETS = "assets";
const CORE_ASSETS = [CORE, ASSETS].join("/");

const section = function section(title: string, id: string, files: readonly string[]): Section {
    return { icon: ICON, id, subsections: files.map((name) => ({ id: `file-${name}`, title: name })), title };
};

const SECTIONS: readonly Section[] = [
    section(ROOT_LABEL, "folder-root", ["index.html"]),
    section(CORE, "folder-core", []),
    section(CORE_ASSETS, "folder-core-assets", ["link.assets.ts", "walk.assets.ts"]),
    section("types", "folder-types", ["base.types.ts"]),
];

const FOLDERS: Readonly<Record<string, readonly string[]>> = {
    "folder-core": ["folder-core-assets"],
    "folder-root": ["folder-core", "folder-types"],
};

const tree = function tree(): ReturnType<typeof treeNodesOf> {
    return treeNodesOf(SECTIONS, FOLDERS);
};

afterEach(() => {
    document.body.replaceChildren();
});

describe("treeNodesOf", () => {
    it("nests the sections into folders by the folder map, and answers null for no sections", () => {
        const root = tree();
        expect(root?.name).toBe(ROOT_LABEL);
        expect(root?.folders.map((folder) => folder.name)).toStrictEqual(["core", "types"]);
        expect(root?.folders[0]?.folders[0]?.path).toBe(CORE_ASSETS);
        expect(root?.folders[0]?.folders[0]?.files.map((file) => file.name)).toStrictEqual([
            "link.assets.ts",
            "walk.assets.ts",
        ]);
        expect(root?.files[0]?.id).toBe("file-index.html");
        expect(treeNodesOf([], FOLDERS)).toBeNull();
        expect(treeNodesOf(SECTIONS, {})?.folders).toStrictEqual([]);
    });
});

describe("isFolder, ancestorsOf and flatten", () => {
    it("tells folders from files, walks the ancestor chain of a path, and lists every node", () => {
        const root = tree();
        if (root === null) {
            throw new Error(ROOT_LABEL);
        }
        const assets = root.folders[0]?.folders[0];
        expect(isFolder(root)).toBe(true);
        expect(assets === undefined || isFolder(assets)).toBe(true);
        expect(root.files[0] === undefined || isFolder(root.files[0])).toBe(false);
        expect(ancestorsOf(root, CORE_ASSETS).map((folder) => folder.name)).toStrictEqual([ROOT_LABEL, CORE, ASSETS]);
        expect(ancestorsOf(root, [CORE, "missing"].join("/")).map((folder) => folder.name)).toStrictEqual([
            ROOT_LABEL,
            CORE,
        ]);
        expect(flatten(root).map((node) => node.id)).toStrictEqual([
            "folder-root",
            "file-index.html",
            "folder-core",
            "folder-core-assets",
            "file-link.assets.ts",
            "file-walk.assets.ts",
            "folder-types",
            "file-base.types.ts",
        ]);
    });
});

describe("renderTree, treeLink and markSelected", () => {
    it("renders nested details with a link per node, and selecting a node marks it and opens its ancestors", () => {
        const root = tree();
        if (root === null) {
            throw new Error(ROOT_LABEL);
        }
        const rendered = renderTree(root);
        document.body.append(rendered);
        const link = treeLink(root, "sample");
        expect(link.getAttribute(NODE_ATTRIBUTE)).toBe(root.id);
        expect(link.getAttribute("href")).toBe("#folder-root");
        const details = rendered.querySelectorAll("details");
        expect(details).toHaveLength(4);
        markSelected(rendered, "file-walk.assets.ts");
        const selected = rendered.querySelector(`[${NODE_ATTRIBUTE}="file-walk.assets.ts"]`);
        expect(selected?.classList.contains(ACTIVE_CLASS)).toBe(true);
        expect(selected?.closest("details")?.open).toBe(true);
        expect(selected?.closest("details")?.parentElement?.closest("details")?.open).toBe(true);
        expect(rendered.querySelectorAll(`.${ACTIVE_CLASS}`)).toHaveLength(1);
    });

    it("gives a folder whose name is a generic link word its path as context, and leaves a named folder bare", () => {
        const generic = treeNodesOf(
            [section(ROOT_LABEL, "folder-root", []), section("cards/information", "folder-cards-information", [])],
            { "folder-root": ["folder-cards-information"] },
        )?.folders[0];
        if (generic === undefined) {
            throw new Error(ROOT_LABEL);
        }
        expect(generic.name).toBe("information");
        expect(isGenericLabel(treeLink(generic, "sample").textContent)).toBe(false);
        expect(treeLink(generic, "sample").textContent).toContain("cards/information");
        const named = tree()?.folders[0];
        expect(named === undefined ? null : treeLink(named, "sample").textContent).toBe(CORE);
    });
});

describe("targetOf", () => {
    it("reads the node id and an optional line or text out of a hash, and refuses a href with no hash", () => {
        expect(targetOf("/anatomy/tree#file-a:19")).toStrictEqual({ id: "file-a", line: 19, text: null });
        expect(targetOf("#folder-root")).toStrictEqual({ id: "folder-root", line: null, text: null });
        expect(targetOf("#file-a:x")).toStrictEqual({ id: "file-a", line: null, text: "x" });
        expect(targetOf("/anatomy")).toBeNull();
    });
});
