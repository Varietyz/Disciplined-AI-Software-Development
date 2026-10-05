import { CONDITIONAL_SEVERITY, NEGATIVE_KIND } from "#configuration/constants/architecture.constants";
import type { ArchRelations } from "#types/architecture.types";
import type { InvalidSeverity } from "#types/validation.types";
import type { Lexicon } from "#types/lexicon.types";
import { PAG_PREFIX } from "#configuration/constants/reference.constants";
import type { TargetResolverFaces } from "#types/reference.types";
import { conditionalSeverityNeeded } from "#configuration/strings/validation.strings";
import { resolveTarget } from "#core/resolvers/reference.resolver";
import { slugify } from "#core/converters/identifier.converter";

type ExpressionFaces = TargetResolverFaces & { arch: { all: () => { expressedBy?: readonly string[]; id: string }[] } };

export const unresolvedExpressionsOf = function unresolvedExpressionsOf(
    faces: ExpressionFaces,
): { from: string; target: string }[] {
    return faces.arch
        .all()
        .flatMap((principle) =>
            (principle.expressedBy ?? [])
                .filter((target) => !target.startsWith(PAG_PREFIX) || !resolveTarget(faces, target))
                .map((target) => ({ from: principle.id, target })),
        );
};

export const unreachableAntiPatternsOf = function unreachableAntiPatternsOf(arch: ArchRelations): string[] {
    const conflictsTargets = new Set(
        arch
            .all()
            .flatMap((principle) => principle.conflicts_with)
            .map((target) => slugify(target)),
    );
    return arch
        .all()
        .filter((principle) => principle.type === NEGATIVE_KIND)
        .filter(
            (principle) =>
                !conflictsTargets.has(slugify(principle.id)) && !conflictsTargets.has(slugify(principle.name)),
        )
        .map((principle) => principle.id)
        .toSorted((a, b) => a.localeCompare(b));
};

export const crossFaceCollisions = function crossFaceCollisions(arch: ArchRelations, lex: Lexicon): string[] {
    const archIdSet = new Set(arch.ids());
    return lex.ids().filter((id) => archIdSet.has(id));
};

export const invalidSeveritiesOf = function invalidSeveritiesOf(arch: ArchRelations): InvalidSeverity[] {
    return arch
        .all()
        .filter((principle) => principle.mandatoryFor !== undefined && principle.severity !== CONDITIONAL_SEVERITY)
        .map((principle) => ({ id: principle.id, reason: conditionalSeverityNeeded(CONDITIONAL_SEVERITY) }));
};
