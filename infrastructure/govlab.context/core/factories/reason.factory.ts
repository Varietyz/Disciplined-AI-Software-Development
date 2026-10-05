import type { ReasonData, ReasonIndexes, ReasonOntology, ReasonOntologyOptions } from "#types/reason.types";
import { buildIndexes, conceptResolver, resolveId } from "#core/resolvers/reason.resolver";
import { collectIds, kindMembersOf, uncoveredCellsOf } from "#core/selectors/reason.selector";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import { CheckTable } from "#core/stores/check.store";
import { LOADED } from "#configuration/strings/reason.strings";
import { NOOP_LOGGER } from "#core/reporters/ontology.reporter";
import { ReadAudit } from "#core/observers/record.observer";
import { deepFreeze } from "#core/converters/base.converter";
import { defineOntologyFace } from "#core/registries/ontology.registry";
import { loadBundledData } from "#core/loaders/reason.loader";
import { validateReason } from "#core/validators/reason.validator";

type ReasonPort = Omit<ReasonOntology, "checkOf" | "unreadKeys">;

const reasonPort = function reasonPort(data: ReasonData, indexes: ReasonIndexes): ReasonPort {
    const resolveConcept = conceptResolver(indexes.concepts);
    return {
        axes: () => [...data.axes],
        axis: (id) => indexes.axis.get(id) ?? null,
        conceptOf: (nodeId) => {
            const node = indexes.node.get(nodeId);
            return node ? resolveConcept(node) : null;
        },
        derivationLoop: () => data.derivationLoop,
        dimensions: () => [...data.dimensions],
        edges: () => [...data.edges],
        failureShapes: () => [...data.failureShapes],
        ids: () => collectIds(data),
        invariants: () => [...data.invariants],
        kindMembers: () => kindMembersOf(data),
        layers: () => [...data.layers],
        lenses: () => [...data.lenses],
        maps: () => data.maps,
        mathDomains: () => [...data.mathDomains],
        mathType: (id) => indexes.mathType.get(id) ?? null,
        mathTypes: () => [...data.mathTypes],
        models: () => [...data.models],
        modes: () => [...data.modes],
        node: (id) => indexes.node.get(id) ?? null,
        nodes: (axis) =>
            typeof axis === "string" && axis.length > 0
                ? data.nodes.filter((node) => node.axis === axis)
                : [...data.nodes],
        patternTypes: () => [...data.patternTypes],
        representations: () => [...data.representations],
        resolve: resolveId(data, indexes),
        substrate: () => data.substrate,
        techniques: () => [...data.techniques],
        testSurfaces: () => [...data.testSurfaces],
        uncoveredCells: () => uncoveredCellsOf(data),
        universalAxes: () => [...data.universalAxes],
        validateReasonOntology: () => validateReason(data),
    };
};

export const createReason = function createReason(options: ReasonOntologyOptions = {}): ReasonOntology {
    const logger = options.logger ?? NOOP_LOGGER;
    const audit = new ReadAudit(COLLECTIONS.reasoning);
    const checks = new CheckTable();
    const data = deepFreeze(options.data ?? loadBundledData(audit, checks));
    logger.warn(LOADED, { nodes: data.nodes.length });
    return {
        ...reasonPort(data, buildIndexes(data)),
        checkOf: (kind, id) => checks.checkOf(kind, id),
        unreadKeys: () => audit.unread(),
    };
};

export const REASON_FACE = defineOntologyFace<ReasonOntology>({
    build: (context) => createReason({ logger: context.logger }),
    name: COLLECTIONS.reasoning,
});
