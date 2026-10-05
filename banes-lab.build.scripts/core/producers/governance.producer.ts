import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import { ARCH_FACE } from "@govlab/constants";
import { GOVERNED_BY_RELATION } from "@banes-lab/web/constants/graph.constants";
import type { GraphEdge } from "@banes-lab/web/types/graph.types.js";
import { MODULE_MANIFEST_NAME } from "#configuration/constants/loader.constants";
import { absolutePath } from "@ssot/paths";
import { defineProducer } from "#core/factories/producer.factory";
import { principlesOf } from "#core/loaders/manifest.loader";

const FACE_MARK = ":";

const filesOf = function filesOf(folder: AnatomyFolder): readonly AnatomyFile[] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

export default defineProducer({
    name: "governance",
    produce: (context) => {
        const records = new Set(context.ontology.nodes.map((node) => node.ref));
        const folder = absolutePath("app.sources");
        const edges = context.trees
            .flatMap((tree) => filesOf(tree.snapshot.tree))
            .filter((file) => file.name === MODULE_MANIFEST_NAME && file.source !== null)
            .flatMap((file): readonly GraphEdge[] => {
                const from = ANATOMY_PREFIX + context.ids.fileId(file.path);
                return principlesOf(folder, file.source ?? "")
                    .map((id) => ARCH_FACE + FACE_MARK + id)
                    .filter((to) => records.has(to))
                    .map((to) => ({ from, relation: GOVERNED_BY_RELATION, to }));
            });
        return { edges, nodes: [] };
    },
});
