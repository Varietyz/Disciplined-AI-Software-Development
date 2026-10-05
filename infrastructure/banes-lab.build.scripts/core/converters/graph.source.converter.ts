import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import type { Graph, SourceIds, Vocabulary } from "#types/graph.types";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import type { GraphNode } from "@banes-lab/web/types/graph.types.js";
import type { SourceTree } from "#types/source.types";
import { graphNode } from "#core/factories/graph.factory";

const FOLDER_KIND = "folder";
const FILE_KIND = "file";
const DEFINITION_KIND = "definition";
const SOURCE_LAYER = "source:";

interface Scope {
    readonly ids: SourceIds;
    readonly layer: GraphNode["layer"];
    readonly vocabulary: Vocabulary;
}

const fileGraph = function fileGraph(file: AnatomyFile, folderRef: string, scope: Scope): Graph {
    const { ids, layer, vocabulary } = scope;
    const fileRef = ANATOMY_PREFIX + ids.fileId(file.path);
    const definitions = file.definitions.map((definition) => ({
        ...graphNode(ANATOMY_PREFIX + definition.id, DEFINITION_KIND, layer, definition.name),
        href: ids.nodeHref(file.path, definition.line),
    }));
    const calls = file.definitions.flatMap((definition) =>
        definition.callees.map((callee) => ({
            from: ANATOMY_PREFIX + definition.id,
            relation: vocabulary.calls,
            to: ANATOMY_PREFIX + callee.id,
        })),
    );
    return {
        edges: [
            { from: folderRef, relation: vocabulary.contains, to: fileRef },
            ...definitions.map((held) => ({ from: fileRef, relation: vocabulary.contains, to: held.ref })),
            ...calls,
        ],
        nodes: [graphNode(fileRef, FILE_KIND, layer, ids.localPath(file.path)), ...definitions],
    };
};

const folderGraph = function folderGraph(folder: AnatomyFolder, scope: Scope): Graph {
    const ref = ANATOMY_PREFIX + scope.ids.folderId(folder.path);
    const files = folder.files.map((file) => fileGraph(file, ref, scope));
    const children = folder.folders.map((child) => ({
        graph: folderGraph(child, scope),
        ref: ANATOMY_PREFIX + scope.ids.folderId(child.path),
    }));
    return {
        edges: [
            ...children.map((child) => ({ from: ref, relation: scope.vocabulary.contains, to: child.ref })),
            ...files.flatMap((part) => part.edges),
            ...children.flatMap((child) => child.graph.edges),
        ],
        nodes: [
            {
                ...graphNode(ref, FOLDER_KIND, scope.layer, scope.ids.localPath(folder.path)),
                href: scope.ids.folderHref(folder.path),
            },
            ...files.flatMap((part) => part.nodes),
            ...children.flatMap((child) => child.graph.nodes),
        ],
    };
};

export const sourceGraph = function sourceGraph(
    trees: readonly SourceTree[],
    ids: SourceIds,
    vocabulary: Vocabulary,
): Graph {
    const parts = trees.map((tree) =>
        folderGraph(tree.snapshot.tree, { ids, layer: `${SOURCE_LAYER}${tree.tab}`, vocabulary }),
    );
    return { edges: parts.flatMap((part) => part.edges), nodes: parts.flatMap((part) => part.nodes) };
};
