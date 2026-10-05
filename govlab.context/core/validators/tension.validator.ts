import { DEAD_SEED, TENSION_WITHOUT_LAYER, scopeNotLayer } from "#configuration/strings/validation.strings";
import type { LayerJoin, TensionGap } from "#types/layer.types";
import type { Faces } from "#types/context.types";

const tensionEdgeGaps = function tensionEdgeGaps(faces: Faces): TensionGap[] {
    return faces.arch
        .all()
        .flatMap((principle) =>
            principle.tensions_with
                .filter((target) => !faces.layerJoin.resolveTension(principle.id, target))
                .map((target) => ({ from: principle.id, reason: TENSION_WITHOUT_LAYER, target })),
        );
};

const tensionScopeGaps = function tensionScopeGaps(faces: Faces): TensionGap[] {
    const layerNodeIds = new Set(faces.layerJoin.layers().map((layer) => layer.id));
    return faces.layerJoin
        .resolutions()
        .filter((resolution) => !layerNodeIds.has(resolution.scopeA) || !layerNodeIds.has(resolution.scopeB))
        .map((resolution) => ({
            from: resolution.a,
            reason: scopeNotLayer(resolution.scopeA, resolution.scopeB),
            target: resolution.b,
        }));
};

export const tensionIssuesOf = function tensionIssuesOf(faces: Faces): TensionGap[] {
    return [...tensionEdgeGaps(faces), ...tensionScopeGaps(faces)];
};

export const deadSeedsOf = function deadSeedsOf(layerJoin: LayerJoin): TensionGap[] {
    return layerJoin.deadSeeds().map((seed) => ({ from: seed.a, reason: DEAD_SEED, target: seed.b }));
};
