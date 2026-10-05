import {
    EDGES_KEY,
    GRAPH_FILE,
    INDEX_FILE,
    MEMBERSHIP_KEY,
    RESOLUTIONS_KEY,
    TENSION_FILE,
} from "#configuration/constants/layer.constants";
import type { JoinState, LayerEdge, LayerJoin } from "#types/layer.types";
import { asLayerEdge, asLayerMembership, asTensionResolution } from "#core/normalizers/layer.normalizer";
import {
    buildLayerByKey,
    buildLiveEdgePairs,
    buildRefMaps,
    buildResolutionByPair,
    layerOf,
    pairKey,
    resolveTension,
} from "#core/resolvers/layer.resolver";
import type { AlgoGrammar } from "#types/algorithm.types";
import type { ArchRelations } from "#types/architecture.types";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { Lexicon } from "#types/lexicon.types";
import { ReadAudit } from "#core/observers/record.observer";
import { readLayerList } from "#core/loaders/layer.loader";

interface JoinSources {
    arch: ArchRelations;
    algo: AlgoGrammar;
    lex: Lexicon;
}

const buildJoinState = function buildJoinState(sources: JoinSources, audit: ReadAudit): JoinState {
    const edges = readLayerList(audit, GRAPH_FILE, EDGES_KEY, asLayerEdge);
    const membership = readLayerList(audit, INDEX_FILE, MEMBERSHIP_KEY, asLayerMembership);
    const resolutionList = readLayerList(audit, TENSION_FILE, RESOLUTIONS_KEY, asTensionResolution);
    const refs = buildRefMaps(sources.arch);
    return {
        edges,
        layerByKey: buildLayerByKey(membership),
        liveEdgePairs: buildLiveEdgePairs(sources.arch, refs),
        refs,
        resolutionByPair: buildResolutionByPair(resolutionList, refs),
        resolutionList,
        termCategoryOf: (idOrName) => sources.lex.resolve(idOrName)?.category ?? null,
        titleOf: (id) => sources.algo.get(id)?.title ?? null,
    };
};

const nodeIds = function nodeIds(edges: readonly LayerEdge[]): string[] {
    return [...new Set(edges.flatMap((edge) => [edge.from, edge.to]))].toSorted((a, b) => a.localeCompare(b));
};

export const createLayerJoin = function createLayerJoin(sources: JoinSources): LayerJoin {
    const audit = new ReadAudit(COLLECTIONS.layers);
    const state = buildJoinState(sources, audit);
    return {
        deadSeeds: () =>
            state.resolutionList.filter((seed) => !state.liveEdgePairs.has(pairKey(state.refs, seed.a, seed.b))),
        layerOf: (idOrName) => layerOf(state, idOrName),
        layers: () => nodeIds(state.edges).map((id) => ({ id, label: state.titleOf(id) ?? id })),
        resolutions: () => [...state.resolutionList],
        resolveTension: (a, b) => resolveTension(state, a, b),
        topology: () => [...state.edges],
        unreadKeys: () => audit.unread(),
    };
};
