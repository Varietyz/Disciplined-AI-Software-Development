export const undeclaredReasonKind = function undeclaredReasonKind(kind: string): string {
    return `reason: the kind "${kind}" is not declared in the reasoning taxonomy`;
};

export const predicateTypeOf = function predicateTypeOf(surface: string): string {
    return `reason: the predicate type of test surface "${surface}"`;
};

export const evidenceSourceOf = function evidenceSourceOf(surface: string): string {
    return `reason: the evidence source of test surface "${surface}"`;
};

export const verdictOf = function verdictOf(surface: string): string {
    return `reason: a verdict of test surface "${surface}"`;
};

export const LOADED = "reason-ontology: loaded";

export const TRANSITION_FROM = "from is not a stage";

export const TRANSITION_TO = "to is not a stage";

export const TRANSITION_GATE = "gate is not a node";

export const EVERY_STEP = "*";

export const undeclaredModel = function undeclaredModel(model: string): string {
    return `reason: the model "${model}" that orders the reasoning rungs is not declared`;
};
