import type { CollectionKind, ConceptIndexes, ReasonData, ReasonIndexes, ReasonResolution } from "#types/reason.types";
import { CONCEPT_COLLECTION_BY_AXIS } from "#configuration/constants/reason.constants";
import type { ReasonNode } from "#types/reason.node.types";

const indexById = function indexById<R extends { id: string }>(records: readonly R[]): Map<string, R> {
    const map = new Map<string, R>();
    for (const record of records) {
        if (!map.has(record.id)) {
            map.set(record.id, record);
        }
    }
    return map;
};

export const buildIndexes = function buildIndexes(data: ReasonData): ReasonIndexes {
    return {
        axis: indexById(data.axes),
        concepts: {
            dimension: indexById(data.dimensions),
            lens: indexById(data.lenses),
            mode: indexById(data.modes),
            representation: indexById(data.representations),
        },
        failureShape: indexById(data.failureShapes),
        invariant: indexById(data.invariants),
        layer: indexById(data.layers),
        mathDomain: indexById(data.mathDomains),
        mathType: indexById(data.mathTypes),
        model: indexById(data.models),
        node: indexById(data.nodes),
        patternType: indexById(data.patternTypes),
        substrateNode: indexById(data.substrate.nodes),
        technique: indexById(data.techniques),
        testSurface: indexById(data.testSurfaces),
        universalAxis: indexById(data.universalAxes),
    };
};

const conceptMap = function conceptMap(
    concepts: ConceptIndexes,
    kind: CollectionKind,
): ReadonlyMap<string, object> | null {
    const byKind: Partial<Record<CollectionKind, ReadonlyMap<string, object>>> = {
        dimension: concepts.dimension,
        lens: concepts.lens,
        mode: concepts.mode,
        representation: concepts.representation,
    };
    return byKind[kind] ?? null;
};

export const conceptResolver = function conceptResolver(
    concepts: ConceptIndexes,
): (node: ReasonNode) => ReasonResolution | null {
    return (node) => {
        if (typeof node.concept !== "string") {
            return null;
        }
        const kind = CONCEPT_COLLECTION_BY_AXIS.get(node.axis);
        const record = kind ? (conceptMap(concepts, kind)?.get(node.concept) ?? null) : null;
        return record && kind ? { kind, record } : null;
    };
};

const resolveOrder = function resolveOrder(
    indexes: ReasonIndexes,
): readonly [CollectionKind, ReadonlyMap<string, object>][] {
    return [
        ["node", indexes.node],
        ["axis", indexes.axis],
        ["layer", indexes.layer],
        ["math-type", indexes.mathType],
        ["substrate-node", indexes.substrateNode],
        ["dimension", indexes.concepts.dimension],
        ["lens", indexes.concepts.lens],
        ["mode", indexes.concepts.mode],
        ["representation", indexes.concepts.representation],
        ["math-domain", indexes.mathDomain],
        ["pattern-type", indexes.patternType],
        ["model", indexes.model],
        ["universal-axis", indexes.universalAxis],
        ["test-surface", indexes.testSurface],
        ["technique", indexes.technique],
        ["invariant", indexes.invariant],
        ["failure-shape", indexes.failureShape],
    ];
};

export const resolveId = function resolveId(
    data: ReasonData,
    indexes: ReasonIndexes,
): (id: string) => ReasonResolution | null {
    const order = resolveOrder(indexes);
    return (id) => {
        if (id === data.derivationLoop.id) {
            return { kind: "loop", record: data.derivationLoop };
        }
        const hit = order.find(([, map]) => map.has(id));
        return hit === undefined ? null : { kind: hit[0], record: hit[1].get(id) };
    };
};
