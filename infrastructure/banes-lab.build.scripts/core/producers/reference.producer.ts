import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import type { GraphEdge } from "@banes-lab/web/types/graph.types.js";
import { REFERENCES_RELATION } from "@banes-lab/web/constants/graph.constants";
import { absolutePath } from "@ssot/paths";
import { codeTargetRefOf } from "#core/resolvers/evidence.resolver";
import { defineProducer } from "#core/factories/producer.factory";
import { join } from "node:path";
import { referenceTargetsOf } from "#core/loaders/reference.loader";

const filesOf = function filesOf(folder: AnatomyFolder): readonly AnatomyFile[] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

export default defineProducer({
    name: "reference",
    produce: (context) => {
        const roots = context.trees.map((tree) => tree.snapshot.tree);
        const refOf = codeTargetRefOf(roots, context.ids);
        const folder = absolutePath("app.sources");
        const edges = roots.flatMap(filesOf).flatMap((file): readonly GraphEdge[] => {
            if (file.references === undefined) {
                return [];
            }
            const from = ANATOMY_PREFIX + context.ids.fileId(file.path);
            const targets = referenceTargetsOf(join(folder, file.references)).flatMap((target) => {
                const to = refOf(target);
                return to === null || to === from ? [] : [to];
            });
            return [...new Set(targets)].map((to) => ({ from, relation: REFERENCES_RELATION, to }));
        });
        return { edges, nodes: [] };
    },
});
