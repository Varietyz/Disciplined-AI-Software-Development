import {
    CELL_SEPARATOR,
    CONCEPT_COLLECTION_BY_AXIS,
    FREE_STEP_KIND,
    REASON_COLLECTION,
    SHAPE_SEPARATOR,
} from "#configuration/constants/reason.constants";
import { EVERY_STEP, TRANSITION_FROM, TRANSITION_GATE, TRANSITION_TO } from "#configuration/strings/reason.strings";
import { REASON_KINDS, kindMembersOf } from "#core/selectors/reason.selector";
import type { ReasonData, ReasonOntologyIssues } from "#types/reason.types";
import { danglingFields, emptyFields } from "#core/validators/field.validator";
import { REASON_SCHEMA } from "#configuration/schemas/reason.schema";
import type { ReasonNode } from "#types/reason.node.types";

type Issues = Omit<ReasonOntologyIssues, "total">;

const TARGET_PREFIX = `${REASON_COLLECTION}:`;

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

const idSet = function idSet(records: readonly { id: string }[]): Set<string> {
    return new Set(records.map((record) => record.id));
};

const duplicateIdsOf = function duplicateIdsOf(data: ReasonData): string[] {
    return [...REASON_KINDS].flatMap(([kind, recordsOf]) => {
        const seen = new Set<string>();
        return recordsOf(data).flatMap((record) => {
            const duplicate = seen.has(record.id);
            seen.add(record.id);
            return duplicate ? [`${kind}:${record.id}`] : [];
        });
    });
};

const danglingFieldsOf = function danglingFieldsOf(data: ReasonData): Issues["danglingFields"] {
    const members = kindMembersOf(data);
    const membersOf = (target: string): ReadonlySet<string> | undefined =>
        target.startsWith(TARGET_PREFIX) ? members.get(target.slice(TARGET_PREFIX.length)) : undefined;
    return [...REASON_KINDS].flatMap(([kind, recordsOf]) => {
        const schema = REASON_SCHEMA.get(kind);
        return schema === undefined ? [] : danglingFields(kind, schema, recordsOf(data), membersOf);
    });
};

const emptyFieldsIn = function emptyFieldsIn(data: ReasonData): Issues["emptyFields"] {
    return [...REASON_KINDS].flatMap(([kind, recordsOf]) => {
        const schema = REASON_SCHEMA.get(kind);
        return schema === undefined
            ? []
            : recordsOf(data).flatMap((record) =>
                  emptyFields(schema, record).map((field) => ({ field, id: record.id, kind })),
              );
    });
};

const conceptDangling = function conceptDangling(data: ReasonData): Issues["danglingConcepts"] {
    const concepts = new Map<string, Set<string>>([
        ["dimension", idSet(data.dimensions)],
        ["lens", idSet(data.lenses)],
        ["mode", idSet(data.modes)],
        ["representation", idSet(data.representations)],
    ]);
    const resolves = (node: ReasonNode): boolean => {
        const kind = CONCEPT_COLLECTION_BY_AXIS.get(node.axis);
        return kind !== undefined && (concepts.get(kind)?.has(node.concept ?? "") ?? false);
    };
    return data.nodes
        .filter((node) => typeof node.concept === "string" && !resolves(node))
        .map((node) => ({ concept: node.concept ?? "", node: node.id }));
};

const transitionDangling = function transitionDangling(
    data: ReasonData,
    stageIds: Set<string>,
    nodeIds: Set<string>,
): Issues["danglingTransitions"] {
    return data.derivationLoop.transitions.flatMap((transition) =>
        [
            stageIds.has(transition.from) ? null : TRANSITION_FROM,
            stageIds.has(transition.to) ? null : TRANSITION_TO,
            typeof transition.gate === "string" && !nodeIds.has(transition.gate) ? TRANSITION_GATE : null,
        ].flatMap((reason) => (reason === null ? [] : [{ from: transition.from, reason, to: transition.to }])),
    );
};

const edgeSourceDangling = function edgeSourceDangling(
    data: ReasonData,
    nodeIds: Set<string>,
    stageIds: Set<string>,
): string[] {
    return data.edges
        .filter((edge) => !nodeIds.has(edge.from) && !stageIds.has(edge.from) && edge.from !== data.derivationLoop.id)
        .map((edge) => edge.from)
        .toSorted(byName);
};

const collidingSurfaceCells = function collidingSurfaceCells(data: ReasonData): Issues["collidingSurfaceCells"] {
    const byCell = new Map<string, string[]>();
    for (const surface of data.testSurfaces) {
        const cell = `${surface.dimension}${CELL_SEPARATOR}${surface.lens}`;
        byCell.set(cell, [...(byCell.get(cell) ?? []), surface.id]);
    }
    return [...byCell]
        .filter(([, surfaces]) => surfaces.length > 1)
        .map(([cell, surfaces]) => ({ cell, surfaces: surfaces.toSorted(byName) }));
};

const shapesOf = function shapesOf(yieldsShape: string): Set<string> {
    return new Set(
        yieldsShape
            .split(SHAPE_SEPARATOR)
            .map((shape) => shape.trim())
            .filter((shape) => shape.length > 0),
    );
};

const answerShapeMismatches = function answerShapeMismatches(data: ReasonData): Issues["answerShapeMismatches"] {
    const yields = new Map(data.mathTypes.map((mathType) => [mathType.id, mathType.yieldsShape]));
    return data.nodes.flatMap((node) => {
        const allowed = yields.get(node.mathType) ?? "";
        return node.answerShape === undefined || shapesOf(allowed).has(node.answerShape)
            ? []
            : [{ allowed, answerShape: node.answerShape, node: node.id }];
    });
};

const unresolvedModelSteps = function unresolvedModelSteps(data: ReasonData): Issues["unresolvedModelSteps"] {
    const members = kindMembersOf(data);
    return data.models.flatMap((model) => {
        if (model.stepKind === FREE_STEP_KIND) {
            return [];
        }
        const kind = members.get(model.stepKind);
        if (kind === undefined) {
            return [{ model: model.id, step: EVERY_STEP, stepKind: model.stepKind }];
        }
        return model.sequence
            .filter((step) => !kind.has(step))
            .map((step) => ({ model: model.id, step, stepKind: model.stepKind }));
    });
};

export const validateReason = function validateReason(data: ReasonData): ReasonOntologyIssues {
    const nodeIds = idSet(data.nodes);
    const stageIds = new Set(data.derivationLoop.stages.map((stage) => stage.id));
    const parts: Issues = {
        answerShapeMismatches: answerShapeMismatches(data),
        collidingSurfaceCells: collidingSurfaceCells(data),
        danglingConcepts: conceptDangling(data),
        danglingEdgeSources: edgeSourceDangling(data, nodeIds, stageIds),
        danglingFields: danglingFieldsOf(data),
        danglingTransitions: transitionDangling(data, stageIds, nodeIds),
        duplicateIds: duplicateIdsOf(data),
        emptyFields: emptyFieldsIn(data),
        unresolvedModelSteps: unresolvedModelSteps(data),
    };
    return { ...parts, total: Object.values(parts).reduce((count, findings) => count + findings.length, 0) };
};
