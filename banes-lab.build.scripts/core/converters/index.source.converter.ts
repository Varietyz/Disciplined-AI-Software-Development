import { API_PREFIX, INDEX_KIND } from "#configuration/constants/catalog.constants";
import type { IndexPlan, SourcePlans } from "#types/index.types";
import { folderIndex, treeIndex } from "#core/resolvers/catalog.resolver";
import type { AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import type { Identity } from "#types/catalog.types";
import type { SourceFile } from "#types/source.types";
import { holdsFiles } from "#core/predicates/folder.predicate";

const SLASH = "/";
const SOURCE_PATH = "source/";

const folderRef = function folderRef(tree: string, path: string): string {
    return API_PREFIX + SOURCE_PATH + tree + SLASH + path;
};

export const sourceIndexPlans = function sourceIndexPlans(
    files: readonly SourceFile[],
    localPath: (path: string) => string,
): SourcePlans {
    const trees = [...new Map(files.map((file) => [file.tree.tab, file.tree])).values()];
    const fileRefs = new Map(files.map((file) => [file.file.path, file.identity.ref]));
    const folders: IndexPlan[] = [];
    const treePlans = trees.map((tree) => {
        const refsOf = (folder: AnatomyFolder): readonly string[] => [
            ...folder.folders.filter(holdsFiles).map((child) => folderRef(tree.tab, localPath(child.path))),
            ...folder.files.flatMap((file) => {
                const ref = fileRefs.get(file.path);
                return ref === undefined ? [] : [ref];
            }),
        ];
        const visit = (folder: AnatomyFolder): void => {
            for (const child of folder.folders.filter(holdsFiles)) {
                const path = localPath(child.path);
                const identity: Identity = {
                    address: folderIndex(tree.tab, path),
                    href: null,
                    kind: INDEX_KIND,
                    ref: folderRef(tree.tab, path),
                    summary: null,
                    title: path,
                };
                const data = { path, ref: identity.ref, title: path, tree: tree.tab };
                folders.push({ data, identity, refs: refsOf(child) });
                visit(child);
            }
        };
        visit(tree.snapshot.tree);
        const identity: Identity = {
            address: treeIndex(tree.tab),
            href: null,
            kind: INDEX_KIND,
            ref: API_PREFIX + SOURCE_PATH + tree.tab,
            summary: null,
            title: tree.label,
        };
        const data = { ref: identity.ref, title: tree.label, tree: tree.tab };
        return { data, identity, refs: refsOf(tree.snapshot.tree) };
    });
    return { folders, trees: treePlans };
};
