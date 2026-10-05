import { ALGORITHM_LABEL } from "#configuration/constants/ontology.constants";

export const tierOf = function tierOf(domain: string): string {
    return `algo: the tier of domain "${domain}"`;
};

export const derivationUnknownStage = function derivationUnknownStage(stage: string): string {
    return `derivationMap stage "${stage}" is not a derivation-loop stage`;
};

export const derivationSelfMapped = function derivationSelfMapped(stage: string): string {
    return `derivationMap stage "${stage}" maps to the contract itself (no distinct realizer)`;
};

export const derivationUnknownRecord = function derivationUnknownRecord(record: string): string {
    return `derivationMap record "${record}" resolves to no algo contract`;
};

export const derivationUnstaged = function derivationUnstaged(missing: readonly string[]): string {
    return `derivationMap omits mandatory-always stage(s): ${missing.join(", ")}`;
};

export const unknownClosureId = function unknownClosureId(id: string): string {
    return `${ALGORITHM_LABEL}: resolveClosure() got the unknown id "${id}"`;
};
