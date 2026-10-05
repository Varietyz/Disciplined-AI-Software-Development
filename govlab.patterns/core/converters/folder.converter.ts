import type { TreeGroup, TreeLeaf, TreeNode } from "#types/page.types";
import type { FileEntry } from "#types/package.types";

const PATH_SEP = "/";

const relParts = function relParts(rel: string, root: string): string[] {
    return (root === "" ? rel : rel.slice(root.length + 1)).split(PATH_SEP);
};

const leafOf = function leafOf(entry: FileEntry, rel: string): TreeLeaf {
    return {
        count: entry.walk.length,
        entry,
        kind: "file",
        name: relParts(entry.rel, rel)[0] ?? entry.rel,
        rel: entry.rel,
    };
};

export const buildGroup = function buildGroup(entries: readonly FileEntry[], rel: string, name: string): TreeGroup {
    const leaves = entries.filter((entry) => relParts(entry.rel, rel).length === 1).map((entry) => leafOf(entry, rel));
    const deeper = entries.filter((entry) => relParts(entry.rel, rel).length > 1);
    const dirNames = [...new Set(deeper.map((entry) => relParts(entry.rel, rel)[0] ?? ""))];
    const dirs = dirNames.map((dirName) =>
        buildGroup(
            deeper.filter((entry) => (relParts(entry.rel, rel)[0] ?? "") === dirName),
            rel === "" ? dirName : `${rel}${PATH_SEP}${dirName}`,
            dirName,
        ),
    );
    const children: TreeNode[] = [...leaves, ...dirs];
    return { children, count: children.reduce((sum, child) => sum + child.count, 0), kind: "dir", name, rel };
};

export const subtreeFiles = function subtreeFiles(node: TreeNode): FileEntry[] {
    return node.kind === "file" ? [node.entry] : node.children.flatMap(subtreeFiles);
};
