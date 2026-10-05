import type { DanglingField } from "#types/field.types";

export const duplicateReasonId = function duplicateReasonId(entry: string): string {
    return `duplicate id ${entry}`;
};

export const danglingConcept = function danglingConcept(node: string, concept: string): string {
    return `node ${node} → concept ${concept}`;
};

export const danglingReasonField = function danglingReasonField(entry: DanglingField): string {
    return `${entry.kind} ${entry.id} → ${entry.field} ${entry.value} is not a ${entry.target} record`;
};

export const emptyReasonField = function emptyReasonField(entry: { kind: string; id: string; field: string }): string {
    return `${entry.kind} ${entry.id} → ${entry.field} is empty, and its kind requires a value`;
};

export const danglingTransition = function danglingTransition(entry: {
    from: string;
    to: string;
    reason: string;
}): string {
    return `transition ${entry.from}→${entry.to} (${entry.reason})`;
};

export const danglingEdgeSource = function danglingEdgeSource(source: string): string {
    return `edge source ${source}`;
};

export const collidingCell = function collidingCell(cell: string, surfaces: readonly string[]): string {
    return `cell ${cell} → colliding surfaces ${surfaces.join(", ")}`;
};

export const answerShapeMismatch = function answerShapeMismatch(entry: {
    node: string;
    answerShape: string;
    allowed: string;
}): string {
    return `node ${entry.node} → answerShape ${entry.answerShape} is not among its mathType's ${entry.allowed}`;
};

export const unresolvedModelStep = function unresolvedModelStep(entry: {
    model: string;
    step: string;
    stepKind: string;
}): string {
    return `model ${entry.model} → step ${entry.step} is not a ${entry.stepKind} record`;
};

export const TENSION_WITHOUT_LAYER = "no derived or explicit resolution (an endpoint resolves to no layer)";

export const scopeNotLayer = function scopeNotLayer(scopeA: string, scopeB: string): string {
    return `explicit resolution scope is not a layer node (${scopeA}/${scopeB})`;
};

export const DEAD_SEED = "explicit resolution seed matches no live tensions_with edge";

export const nonCanonicalKind = function nonCanonicalKind(kind: string): string {
    return `kind "${kind}" is not one of the 14 canonical kinds`;
};

export const EMPTY_DEFINITION = "definition is empty";

export const MISSING_EXEMPLAR = "missing before/after exemplar";

export const IDENTICAL_EXEMPLAR = "exemplar before and after are identical";

export const CODELESS_EXEMPLAR = "code-medium exemplar with no code syntax (mislabeled medium?)";

export const conditionalSeverityNeeded = function conditionalSeverityNeeded(severity: string): string {
    return `mandatoryFor needs the "${severity}" level`;
};

export const DISTINCT_SELF = "names the record itself";

export const DISTINCT_UNKNOWN = "names no architecture, lexicon or keyword record";

export const DISTINCT_UNREASONED = "gives no reason";

export const DISTINCT_UNKNOWN_CONTRACT = "names no algorithms record";

export const ALIAS_EMPTY = "holds no letter or digit, so it keys nothing";

export const ALIAS_REPEATS_NAME = "repeats the record's own name or id";

export const ALIAS_FOLDED =
    "differs from the record's name only by a plural or a spelling, which every lookup folds already";

export const REPAIR_NO_RECORD = "names no record";

export const FORMED_BY_MISPLACED = "carries formed_by, which only an anti-pattern holds";

export const FORMED_BY_MISSING = "is an anti-pattern with no formed_by sentence on how it forms";

export const VIOLATED_BY_MISSING = "names no anti-pattern that violates it";

export const repairWrongKind = function repairWrongKind(kind: string, admitted: readonly string[]): string {
    return `names a ${kind}, where the field admits ${admitted.join(", ")}`;
};

export const aliasCollides = function aliasCollides(refs: readonly string[]): string {
    return `is also a name or alias of ${refs.join(", ")}, and the records do not list each other in distinctFrom`;
};

export const siblingsUnder = function siblingsUnder(key: string): string {
    return `siblings under ${key}`;
};

export const TENSION_CHECK = "the tension resolution with ";
