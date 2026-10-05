import type { HexPage, TreeGroup, TreeLeaf, TreeNode } from "#types/page.types";
import { INLINE_THRESHOLD, ROOT_PAGE, SLUG_JOIN } from "#configuration/constants/report.constants";
import type { Crumb } from "#types/report.types";
import { subtreeFiles } from "#core/converters/folder.converter";

const PATH_SEP = "/";

export const pageBaseName = function pageBaseName(rel: string): string {
    return rel === "" ? ROOT_PAGE : rel.split(PATH_SEP).join(SLUG_JOIN);
};

export const planNode = function planNode(node: TreeNode, crumbs: readonly Crumb[]): HexPage[] {
    const base = { crumbs: [...crumbs], label: node.name, page: pageBaseName(node.rel), rel: node.rel };
    if (node.kind === "file" || node.count <= INLINE_THRESHOLD) {
        return [{ ...base, drilled: [], inlined: subtreeFiles(node) }];
    }
    const ownFiles = node.children.filter((child): child is TreeLeaf => child.kind === "file");
    const subDirs = node.children.filter((child): child is TreeGroup => child.kind === "dir");
    const childCrumbs: Crumb[] = [...crumbs, { label: node.name, page: base.page }];
    const self: HexPage = { ...base, drilled: node.children, inlined: ownFiles.map((leaf) => leaf.entry) };
    return [self, ...subDirs.flatMap((child) => planNode(child, childCrumbs))];
};
