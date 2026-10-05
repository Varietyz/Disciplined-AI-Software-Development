import type { FolderRelations, FolderTools, SourceTree } from "#types/source.types";
import type { Identity, Link, Linker } from "#types/catalog.types";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import type { AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";

const linkTo = function linkTo(linker: Linker, identity: Identity | null): readonly Link[] {
    return identity === null ? [] : [linker.link(identity.title, identity.ref)];
};

export const folderRelations = function folderRelations(
    trees: readonly SourceTree[],
    tools: FolderTools,
    linker: Linker,
): ReadonlyMap<string, FolderRelations> {
    const relations = new Map<string, FolderRelations>();
    const visit = function visit(folder: AnatomyFolder, parent: Identity | null): void {
        const self = linker.byHref(tools.folderHref(folder.path));
        if (self !== null) {
            const files = folder.files.flatMap((file) => [linker.byRef(ANATOMY_PREFIX + tools.fileId(file.path))]);
            relations.set(self.ref, {
                containedIn: parent === null ? null : linker.link(parent.title, parent.ref),
                contains: [
                    ...folder.folders.flatMap((child) => linkTo(linker, linker.byHref(tools.folderHref(child.path)))),
                    ...files.flatMap((file) => linkTo(linker, file)),
                ],
            });
            for (const file of files) {
                if (file !== null) {
                    relations.set(file.ref, { containedIn: linker.link(self.title, self.ref), contains: [] });
                }
            }
        }
        for (const child of folder.folders) {
            visit(child, self);
        }
    };
    for (const tree of trees) {
        visit(tree.snapshot.tree, null);
    }
    return relations;
};
