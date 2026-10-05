import type { DerivationLoopView, ReasonNodeView } from "@banes-lab/web/types/loop.types.js";
import { REASON_FACE, REFERENCED_BY_RELATION, STAGE_FACE } from "@govlab/constants";
import type { ReferenceIndex, ReferenceRecord } from "@banes-lab/web/types/reference.types.js";
import { loopSummary, nodeSummary, substrateSummary } from "@banes-lab/web/strings/catalog.strings";
import { nameOf, recordOf, titleOf } from "#core/converters/reference.field.converter";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { ReasonView } from "@banes-lab/web/types/reason.types.js";
import { refOf } from "#core/resolvers/ontology.resolver";

const HYPHEN = "-";
const MODEL_KIND = "model";
const STAGES_RELATION = "stages";
const STAGE_KIND = "stage";

interface Anchored {
    readonly anchor: string;
    readonly id: string;
}

const kindOfAnchor = function kindOfAnchor(anchor: string, id: string): string {
    return anchor.slice(0, anchor.length - id.length - HYPHEN.length);
};

const reasonCollections = function reasonCollections(reason: ReasonView): readonly (readonly Anchored[])[] {
    return [
        reason.axes,
        reason.nodes,
        reason.substrate.nodes,
        reason.dimensions,
        reason.invariants,
        reason.layers,
        reason.lenses,
        reason.mathDomains,
        reason.mathTypes,
        reason.models,
        reason.modes,
        reason.patternTypes,
        reason.representations,
        reason.techniques,
        reason.testSurfaces,
        reason.universalAxes,
        [reason.derivationLoop],
    ];
};

const inboundOf = function inboundOf(records: ReadonlyMap<string, ReferenceRecord>): ReadonlyMap<string, EdgeRef[]> {
    const inbound = new Map<string, EdgeRef[]>();
    for (const [ref, record] of records) {
        const targets = record.relations.flatMap((relation) => relation.edges.map((edge) => edge.ref));
        for (const target of targets) {
            if (target !== null && records.has(target) && target !== ref) {
                inbound.set(target, [...(inbound.get(target) ?? []), { label: record.name, ref }]);
            }
        }
    }
    return inbound;
};

const describedNode = function describedNode(record: ReferenceRecord, node: ReasonNodeView): ReferenceRecord {
    return node.concept === null
        ? record
        : {
              ...record,
              summary: record.summary ?? nodeSummary(node.concept.label, node.axis.label, node.mathType.label),
          };
};

const describedLoop = function describedLoop(record: ReferenceRecord, loop: DerivationLoopView): ReferenceRecord {
    const stages = loop.stages.map((stage) => ({ label: titleOf(stage.id), ref: refOf(STAGE_FACE, stage.id) }));
    return {
        ...record,
        relations: [...record.relations, { edges: stages, relation: STAGES_RELATION }],
        summary:
            record.summary ??
            loopSummary(
                record.name,
                stages.map((stage) => stage.label),
            ),
    };
};

const describedRecords = function describedRecords(
    reason: ReasonView,
    built: ReadonlyMap<string, ReferenceRecord>,
): ReadonlyMap<string, ReferenceRecord> {
    const nodes = new Map(reason.nodes.map((node) => [refOf(REASON_FACE, node.anchor), node]));
    const loopRef = refOf(REASON_FACE, reason.derivationLoop.anchor);
    return new Map(
        [...built].map(([ref, record]) => {
            const node = nodes.get(ref);
            if (node !== undefined) {
                return [ref, describedNode(record, node)];
            }
            return [ref, ref === loopRef ? describedLoop(record, reason.derivationLoop) : record];
        }),
    );
};

const describeSubstrate = function describeSubstrate(
    reason: ReasonView,
    records: ReadonlyMap<string, ReferenceRecord>,
    inbound: ReadonlyMap<string, EdgeRef[]>,
): ReadonlyMap<string, string> {
    return new Map(
        reason.substrate.nodes.map((node) => {
            const ref = refOf(REASON_FACE, node.anchor);
            const models = (inbound.get(ref) ?? [])
                .filter((edge) => edge.ref !== null && records.get(edge.ref)?.kind === MODEL_KIND)
                .map((edge) => edge.label);
            return [ref, substrateSummary(node.layer.label, node.mathType.label, models)];
        }),
    );
};

export const reasonReferencesOf = function reasonReferencesOf(reason: ReasonView): ReferenceIndex {
    const built = new Map(
        reasonCollections(reason)
            .flat()
            .map((view) => [
                refOf(REASON_FACE, view.anchor),
                recordOf(view, kindOfAnchor(view.anchor, view.id), nameOf(view, view.id)),
            ]),
    );
    const outbound = describedRecords(reason, built);
    const inbound = inboundOf(outbound);
    const substrate = describeSubstrate(reason, outbound, inbound);
    const index: Record<string, ReferenceRecord> = {};
    for (const [ref, record] of outbound) {
        const referencedBy = inbound.get(ref) ?? [];
        const summary = record.summary ?? substrate.get(ref) ?? null;
        index[ref] =
            referencedBy.length === 0
                ? { ...record, summary }
                : {
                      ...record,
                      relations: [...record.relations, { edges: referencedBy, relation: REFERENCED_BY_RELATION }],
                      summary,
                  };
    }
    return index;
};

export const stageReferencesOf = function stageReferencesOf(reason: ReasonView): ReferenceIndex {
    const index: Record<string, ReferenceRecord> = {};
    const questions = new Map(reason.axes.map((axis) => [refOf(REASON_FACE, axis.anchor), axis.question]));
    for (const stage of reason.derivationLoop.stages) {
        const ref = refOf(STAGE_FACE, stage.id);
        const summary = stage.axis.ref === null ? null : (questions.get(stage.axis.ref) ?? null);
        index[ref] = { ...recordOf(stage, STAGE_KIND, titleOf(stage.id)), summary };
    }
    return index;
};
