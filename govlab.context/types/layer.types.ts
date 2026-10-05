import type {
    LAYER_EDGE_KIND_VOCABULARY,
    RESOLUTION_MECHANISM_VOCABULARY,
} from "#configuration/constants/layer.constants";
import type { UnreadKey } from "#types/record.types";

export interface Layer {
    id: string;
    label: string;
}

export type LayerEdgeKind = (typeof LAYER_EDGE_KIND_VOCABULARY)[number]["value"];

export type ResolutionMechanism = (typeof RESOLUTION_MECHANISM_VOCABULARY)[number]["value"];

export interface LayerEdge {
    from: string;
    to: string;
    kind: LayerEdgeKind;
}

export interface LayerMembership {
    key: string;
    layer: string;
}

export interface TensionResolution {
    a: string;
    b: string;
    mechanism: ResolutionMechanism;
    scopeA: string;
    scopeB: string;
    rule: string;
}

export interface TensionGap {
    from: string;
    target: string;
    reason: string;
}

export interface TensionPair {
    a: string;
    b: string;
    scopeA: string;
    scopeB: string;
}

export interface LayerJoin {
    layers: () => Layer[];
    topology: () => LayerEdge[];
    layerOf: (idOrName: string) => string | null;
    resolutions: () => TensionResolution[];
    deadSeeds: () => TensionResolution[];
    resolveTension: (a: string, b: string) => TensionResolution | null;
    unreadKeys: () => UnreadKey[];
}

export interface RefMaps {
    categoryByRef: Map<string, string>;
    archIdByRef: Map<string, string>;
    archTypeByRef: Map<string, string>;
}

export interface JoinState {
    edges: LayerEdge[];
    resolutionList: TensionResolution[];
    layerByKey: Map<string, string>;
    refs: RefMaps;
    resolutionByPair: Map<string, TensionResolution>;
    liveEdgePairs: Set<string>;
    termCategoryOf: (idOrName: string) => string | null;
    titleOf: (id: string) => string | null;
}
