import type { AnatomyFiles, DerivedTree } from "#types/anatomy.types";

export const ANATOMY_TREE_LABEL = "anatomy";

export const anatomyLine = function anatomyLine(summaries: readonly string[], files: AnatomyFiles): string {
    return `anatomy: derived ${summaries.join("; ")} into ${files.anatomy}, walks under ${files.walks}, sources under ${files.sources}\n`;
};

export const treesLine = function treesLine(count: number, file: string): string {
    return `anatomy: declared ${String(count)} tree(s) from the workspace members into ${file}\n`;
};

export const unpublishedFiles = function unpublishedFiles(folder: string, paths: readonly string[]): string {
    return `trees: ${folder} lacks ${String(paths.length)} file(s) the site links to after the sync: ${paths.join(", ")}. Check what the sync admitted against the tree's published files.`;
};

export const unlicensedTree = function unlicensedTree(tab: string, folder: string): string {
    return `anatomy: the ${tab} tree publishes to the methodology repository, but ${folder} declares no license in its package.json. Add the license the published files carry.`;
};

export const lostReference = function lostReference(
    path: string,
    channel: string,
    text: string,
    candidates: readonly string[],
): string {
    const now = candidates.length === 0 ? "nothing" : candidates.join(", ");
    return `${path} (${channel}) ${JSON.stringify(text)} now resolves to ${now}`;
};

export const lostReferencesLine = function lostReferencesLine(lost: readonly string[]): string {
    return `anatomy: these references resolved to one target in the last build and now resolve to several or to none: ${lost.join("; ")}. Make each name unique again, or qualify the reference so it names one target.`;
};

export const treeSummaryLine = function treeSummaryLine(tree: DerivedTree, folders: number): string {
    const { snapshot } = tree;
    return `${tree.exportName}: ${String(folders)} folder(s), ${String(snapshot.tree.stats.files)} file(s), ${String(snapshot.metrics.definitions)} definition(s)`;
};
