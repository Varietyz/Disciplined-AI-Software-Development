import { CONTRACT_RELATION, REFERENCED_BY_RELATION, TENSIONS_WITH_RELATION } from "@govlab/constants";
import type { LayerNodeView, TensionView } from "@banes-lab/web/types/ontology.types.js";
import { relationOf, singleRelation } from "#core/factories/reference.factory";
import type { ReferenceRecord } from "@banes-lab/web/types/reference.types.js";

const PAIR_JOINER = " / ";
const TENSION_KIND = "tension";
const LAYER_KIND = "layer";
const MECHANISM_RELATION = "mechanism";

export const layerRecord = function layerRecord(
    view: LayerNodeView,
    intents: ReadonlyMap<string, string>,
): ReferenceRecord {
    return {
        code: null,
        kind: LAYER_KIND,
        layer: null,
        name: view.label,
        relations: [
            ...singleRelation(CONTRACT_RELATION, view.contract),
            ...relationOf(REFERENCED_BY_RELATION, view.members),
        ],
        summary: intents.get(view.contract.ref ?? "") ?? null,
    };
};

export const tensionRecord = function tensionRecord(view: TensionView): ReferenceRecord {
    return {
        code: null,
        kind: TENSION_KIND,
        layer: null,
        name: view.a.label + PAIR_JOINER + view.b.label,
        relations: [
            { edges: [view.a, view.b], relation: TENSIONS_WITH_RELATION },
            ...singleRelation(MECHANISM_RELATION, view.mechanism),
        ],
        summary: view.rule,
    };
};
