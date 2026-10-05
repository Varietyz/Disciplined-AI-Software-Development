import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import { DETECTED_BY_RELATION, ENFORCED_BY_RELATION } from "@banes-lab/web/constants/graph.constants";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import { ANATOMY_TREE_DECLARATIONS } from "@banes-lab/web/registries/anatomy.tree.registry";
import type { GraphEdge } from "@banes-lab/web/types/graph.types.js";
import { absolutePath } from "@ssot/paths";
import { defineProducer } from "#core/factories/producer.factory";
import { loadDeclaredChecks } from "@govlab/context";
import { qualifiedPath } from "@banes-lab/web/core/converters/folder.converter.ts";

const PATH_MARK = "/";

const filesOf = function filesOf(folder: AnatomyFolder): readonly AnatomyFile[] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

const treePathOf = function treePathOf(check: string): string | null {
    for (const declaration of ANATOMY_TREE_DECLARATIONS) {
        const prefix = declaration.folder + PATH_MARK;
        if (check.startsWith(prefix)) {
            return qualifiedPath(declaration.tab, check.slice(prefix.length));
        }
    }
    return null;
};

export default defineProducer({
    name: "check",
    produce: (context) => {
        const files = new Set(context.trees.flatMap((tree) => filesOf(tree.snapshot.tree)).map((file) => file.path));
        const edges = (loadDeclaredChecks(absolutePath("govlabHost.checks")) ?? []).flatMap(
            (declared): readonly GraphEdge[] => {
                const path = treePathOf(declared.check);
                if (path === null || !files.has(path)) {
                    return [];
                }
                const to = ANATOMY_PREFIX + context.ids.fileId(path);
                return [
                    ...declared.enforces.map((from) => ({ from, relation: ENFORCED_BY_RELATION, to })),
                    ...declared.detects.map((from) => ({ from, relation: DETECTED_BY_RELATION, to })),
                ];
            },
        );
        return { edges, nodes: [] };
    },
});
