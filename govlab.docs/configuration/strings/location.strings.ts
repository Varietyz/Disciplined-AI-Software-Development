export const unmarkedMember = function unmarkedMember(owners: string): string {
    return `filename carries no member segment — expected "<name>.<member>.md" with member one of: ${owners}`;
};

export const unknownMember = function unknownMember(member: string, owners: string): string {
    return `member "${member}" is not a declared workspace member. Known: ${owners}.`;
};

export const missingConcern = function missingConcern(form: string): string {
    return `form "${form}" is concern-owned — a concern is required`;
};

export const unknownConcern = function unknownConcern(concern: string): string {
    return `concern "${concern}" is not in the injected registry`;
};

export const moduleConcern = function moduleConcern(form: string): string {
    return `form "${form}" is module-owned — it must not carry a concern`;
};

export const unresolvedOwner = function unresolvedOwner(name: string): string {
    return `module owner unresolved for "${name}"`;
};

export const noConcernForm = function noConcernForm(form: string): string {
    return `form "${form}" takes no concern`;
};

export const boundaryForm = function boundaryForm(form: string): string {
    return `form "${form}" is co-located at a module root, not routed into the doc tree`;
};

export const notAuthored = function notAuthored(kind: string): string {
    return `kind "${kind}" is located by its producer, not routed`;
};

export const badName = function badName(name: string): string {
    return `name "${name}" must be a bare stem with no slash or ".md" extension`;
};

export const unknownForm = function unknownForm(form: string): string {
    return `unknown doc form "${form}"`;
};

export const boundaryMisplaced = function boundaryMisplaced(filename: string, rootPrefix: string): string {
    return `boundary doc "${filename}" is co-located by filename — it must not live inside ${rootPrefix}`;
};

export const offLocation = function offLocation(relPath: string, expected: string): string {
    return `document is at "${relPath}" but its form and concern route to "${expected}"`;
};

export const declaredDocFailure = function declaredDocFailure(name: string, reason: string, detail: string): string {
    return `documents: ${name} → ${reason}: ${detail}`;
};
