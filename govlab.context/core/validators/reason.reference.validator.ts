import type { CollectionRefFaces, TargetResolverFaces } from "#types/reference.types";
import { ID_LABEL_SEPARATORS, LABEL_SPACE } from "#configuration/constants/reference.constants";
import {
    answerShapeMismatch,
    collidingCell,
    danglingConcept,
    danglingEdgeSource,
    danglingReasonField,
    danglingTransition,
    duplicateReasonId,
    emptyReasonField,
    unresolvedModelStep,
} from "#configuration/strings/validation.strings";
import { collectionRefResolver, resolveTarget } from "#core/resolvers/reference.resolver";
import type { ReasonOntologyIssues } from "#types/reason.types";

type EdgeFaces = TargetResolverFaces & { reason: { edges: () => { to?: string }[] } };

type LensFaces = TargetResolverFaces & { reason: { lenses: () => { detectedBy?: string[]; id: string }[] } };

export const unresolvedReasonEdgesOf = function unresolvedReasonEdgesOf(faces: EdgeFaces): string[] {
    return faces.reason
        .edges()
        .filter((edge) => typeof edge.to === "string" && !resolveTarget(faces, edge.to))
        .map((edge) => edge.to ?? "")
        .toSorted((a, b) => a.localeCompare(b));
};

export const reasonDefectLines = function reasonDefectLines(issues: ReasonOntologyIssues): string[] {
    return [
        ...issues.duplicateIds.map(duplicateReasonId),
        ...issues.danglingConcepts.map((entry) => danglingConcept(entry.node, entry.concept)),
        ...issues.danglingFields.map(danglingReasonField),
        ...issues.emptyFields.map(emptyReasonField),
        ...issues.danglingTransitions.map(danglingTransition),
        ...issues.danglingEdgeSources.map(danglingEdgeSource),
        ...issues.collidingSurfaceCells.map((entry) => collidingCell(entry.cell, entry.surfaces)),
        ...issues.answerShapeMismatches.map(answerShapeMismatch),
        ...issues.unresolvedModelSteps.map(unresolvedModelStep),
    ];
};

export const unresolvedLensDetectorsOf = function unresolvedLensDetectorsOf(
    faces: LensFaces,
): { lens: string; target: string }[] {
    return faces.reason
        .lenses()
        .flatMap((lens) =>
            (lens.detectedBy ?? [])
                .filter((target) => !resolveTarget(faces, target))
                .map((target) => ({ lens: lens.id, target })),
        );
};

export const unresolvedShapeInstancesOf = function unresolvedShapeInstancesOf(
    faces: CollectionRefFaces & { reason: { failureShapes: () => { id: string; instances: readonly string[] }[] } },
): { shape: string; instance: string }[] {
    const resolve = collectionRefResolver(faces);
    return faces.reason
        .failureShapes()
        .flatMap((shape) =>
            shape.instances.filter((instance) => !resolve(instance)).map((instance) => ({ instance, shape: shape.id })),
        );
};

const isIdShaped = function isIdShaped(label: string): boolean {
    return !label.includes(LABEL_SPACE) && ID_LABEL_SEPARATORS.some((separator) => label.includes(separator));
};

export const idShapedEdgeLabelsOf = function idShapedEdgeLabelsOf(
    faces: CollectionRefFaces & { reason: { edges: () => { from: string; label?: string }[] } },
): { from: string; label: string }[] {
    const resolve = collectionRefResolver(faces);
    return faces.reason
        .edges()
        .flatMap((edge) =>
            typeof edge.label === "string" && isIdShaped(edge.label) && !resolve(edge.label)
                ? [{ from: edge.from, label: edge.label }]
                : [],
        );
};
