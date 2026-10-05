import {
    AXIS_KIND,
    LOOP_KIND,
    MATH_TYPE_KIND,
    REASON_LAYER_KIND,
    STAGE_KIND,
    SUBSTRATE_NODE_KIND,
} from "#configuration/constants/ontology.constants";
import { CONTRACTS_RELATION, STAGE_FACE } from "@govlab/constants";
import type {
    DerivationLoopView,
    LoopStageView,
    SubstrateNodeView,
    SubstrateView,
} from "@banes-lab/web/types/loop.types.js";
import type { MapsView, ReasonEdgeView } from "@banes-lab/web/types/reason.types.js";
import type { ReasonSources } from "#types/ontology.types";
import { lookup } from "#core/converters/ontology.index.converter";
import { orNull } from "#core/converters/base.converter";
import { reasonAnchor } from "#core/resolvers/ontology.resolver";

export const substrateOf = function substrateOf(sources: ReasonSources): SubstrateView {
    const { context, resolve } = sources;
    const substrate = context.reason.substrate();
    const nodes: SubstrateNodeView[] = substrate.nodes.map((node) => ({
        anchor: reasonAnchor(SUBSTRATE_NODE_KIND, node.id),
        id: node.id,
        layer: resolve.reasonAs(REASON_LAYER_KIND, node.layer),
        mathType: resolve.reasonAs(MATH_TYPE_KIND, node.mathType),
        name: node.name,
    }));
    return {
        cycle: substrate.cycle.map((stage) => resolve.reasonAs(SUBSTRATE_NODE_KIND, stage)),
        nodes,
        recursionFrom: resolve.reasonAs(SUBSTRATE_NODE_KIND, substrate.recursion.from),
        recursionTo: resolve.reasonAs(SUBSTRATE_NODE_KIND, substrate.recursion.to),
    };
};

export const loopOf = function loopOf(sources: ReasonSources): DerivationLoopView {
    const { context, index, resolve } = sources;
    const loop = context.reason.derivationLoop();
    const edges = context.reason.edges();
    const stages: LoopStageView[] = loop.stages.map((stage) => ({
        anchor: reasonAnchor(STAGE_KIND, stage.id),
        axis: resolve.reasonAs(AXIS_KIND, stage.axis),
        contracts: lookup(index, CONTRACTS_RELATION, STAGE_FACE, stage.id),
        edges: edges
            .filter((edge) => edge.from === stage.id && edge.to !== undefined)
            .map((edge) => resolve.target(edge.to ?? "")),
        id: stage.id,
    }));
    return {
        anchor: reasonAnchor(LOOP_KIND, loop.id),
        id: loop.id,
        stages,
        transitions: loop.transitions.map((transition) => ({
            from: resolve.stage(transition.from),
            gate: orNull(transition.gate),
            kind: transition.kind,
            onFail: orNull(transition.onFail),
            onPass: orNull(transition.onPass),
            to: resolve.stage(transition.to),
        })),
    };
};

export const mapsOf = function mapsOf(sources: ReasonSources): MapsView {
    const maps = sources.context.reason.maps();
    const { resolve } = sources;
    return {
        foundationLayers: Object.entries(maps.foundations.layers).map(([layer, mathTypes]) => ({
            layer,
            mathTypes: mathTypes.map((mathType) => resolve.reasonAs(MATH_TYPE_KIND, mathType)),
        })),
        foundationSequence: maps.foundations.sequence.map((step) => resolve.reasonAs(MATH_TYPE_KIND, step)),
        invariantGroups: Object.entries(maps.invariants).map(([group, members]) => ({
            group,
            members: members.map((member) => resolve.reasonAs(SUBSTRATE_NODE_KIND, member)),
        })),
        patternOperations: maps.patternOperations.map((operation) => resolve.reasonAs(SUBSTRATE_NODE_KIND, operation)),
    };
};

export const edgesOf = function edgesOf(sources: ReasonSources): readonly ReasonEdgeView[] {
    return sources.context.reason
        .edges()
        .map((edge) => ({
            from: sources.resolve.edgeSource(edge.from),
            label: orNull(edge.label),
            to: edge.to === undefined ? null : sources.resolve.target(edge.to),
        }));
};
