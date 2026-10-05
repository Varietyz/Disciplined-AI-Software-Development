import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import type { HeadAlternates, SourceNodeLink, SourceSubject } from "@banes-lab/web/types/page.types.js";
import type { SourceRoute, SourceRouteTools, SourceTree } from "#types/source.types";
import { folderIndex, sourceLeaf, treeIndex } from "#core/resolvers/catalog.resolver";
import { missingAlternate, sourceFileDescription, sourceFolderDescription } from "#configuration/strings/page.strings";
import type { Address } from "#types/catalog.types";
import { holdsFiles } from "#core/predicates/folder.predicate";
import { summaryOf } from "#core/converters/source.converter";

interface TreeScope {
    readonly tools: SourceRouteTools;
    readonly tree: SourceTree;
}

const alternatesOf = function alternatesOf(address: Address, path: string): HeadAlternates {
    if (address.markdown === null) {
        throw new Error(missingAlternate(path));
    }
    return { json: address.json, markdown: address.markdown };
};

const nameOf = function nameOf(scope: TreeScope, path: string): string {
    const local = scope.tools.localPath(path);
    return local.length === 0 ? scope.tree.label : local;
};

const linkOf = function linkOf(scope: TreeScope, folder: AnatomyFolder): SourceNodeLink {
    return { label: nameOf(scope, folder.path), path: scope.tools.nodeRoute(folder.path, true) };
};

const subjectBase = function subjectBase(
    scope: TreeScope,
    path: string,
    repository: string | undefined,
): Omit<SourceSubject, "alternates" | "description" | "language" | "path"> {
    const { tab } = scope.tree;
    return {
        license: scope.tools.license(tab),
        name: nameOf(scope, path),
        repository: repository ?? null,
        tabPath: scope.tools.tabPath(tab),
        tabTitle: scope.tree.label,
        title: scope.tools.sourceTitle(path),
    };
};

const fileRoute = function fileRoute(scope: TreeScope, file: AnatomyFile, parent: SourceNodeLink): SourceRoute {
    const local = scope.tools.localPath(file.path);
    const path = scope.tools.nodeRoute(file.path, false);
    return {
        children: [],
        parent,
        subject: {
            ...subjectBase(scope, file.path, file.repository),
            alternates: alternatesOf(sourceLeaf(scope.tree.tab, local), path),
            description: sourceFileDescription(local, scope.tree.label, summaryOf(file)),
            language: scope.tools.languageOf(file.name),
            path,
        },
        text: file.source,
    };
};

const folderRoute = function folderRoute(scope: TreeScope, folder: AnatomyFolder, parent: SourceNodeLink): SourceRoute {
    const local = scope.tools.localPath(folder.path);
    const path = scope.tools.nodeRoute(folder.path, true);
    const address = local.length === 0 ? treeIndex(scope.tree.tab) : folderIndex(scope.tree.tab, local);
    const files = folder.files.filter((file) => file.excluded === undefined);
    return {
        children: [
            ...folder.folders.filter(holdsFiles).map((child) => linkOf(scope, child)),
            ...files.map((file) => ({ label: file.name, path: scope.tools.nodeRoute(file.path, false) })),
        ],
        parent,
        subject: {
            ...subjectBase(scope, folder.path, folder.repository),
            alternates: alternatesOf(address, path),
            description: sourceFolderDescription(nameOf(scope, folder.path), scope.tree.label, folder.stats.files),
            language: null,
            path,
        },
        text: null,
    };
};

const routesIn = function routesIn(scope: TreeScope, folder: AnatomyFolder, parent: SourceNodeLink): SourceRoute[] {
    const own = linkOf(scope, folder);
    return [
        folderRoute(scope, folder, parent),
        ...folder.files.filter((file) => file.excluded === undefined).map((file) => fileRoute(scope, file, own)),
        ...folder.folders.filter(holdsFiles).flatMap((child) => routesIn(scope, child, own)),
    ];
};

export const sourceRoutes = function sourceRoutes(
    trees: readonly SourceTree[],
    tools: SourceRouteTools,
): readonly SourceRoute[] {
    return trees.flatMap((tree) => {
        const scope = { tools, tree };
        const top = { label: tree.label, path: tools.tabPath(tree.tab) };
        return routesIn(scope, tree.snapshot.tree, top);
    });
};
