import type { OntologyBuild, OntologyFiles } from "#types/ontology.types";

export const unresolvableTarget = function unresolvableTarget(target: string): string {
    return `ontology: the schema names the target "${target}", which the reverse index cannot resolve. Add a resolver for it.`;
};

export const unreadKind = function unreadKind(kind: string): string {
    return `ontology: the kind "${kind}" declares an inverse field, and the reverse index reads no records of it. Register its collection in KIND_RECORDS.`;
};

export const unregisteredVocabulary = function unregisteredVocabulary(id: string): string {
    return `ontology: no closed vocabulary is registered as "${id}" in CLOSED_VOCABULARIES. Register it there.`;
};

export const unknownSnapshotVocabulary = function unknownSnapshotVocabulary(id: string): string {
    return `ontology: the snapshot carries the vocabulary "${id}", which CLOSED_VOCABULARIES does not register. Register it there.`;
};

export const ontologyLine = function ontologyLine(build: OntologyBuild, files: OntologyFiles): string {
    const { ontology, phrases, references } = build;
    const { snapshot } = ontology;
    const principles = snapshot.principles.reduce((total, group) => total + group.principles.length, 0);
    const terms = snapshot.terms.reduce((total, group) => total + group.terms.length, 0);
    const contracts = snapshot.contracts.reduce((total, group) => total + group.contracts.length, 0);
    return `ontology: wrote ${String(principles)} principle(s), ${String(terms)} term(s), ${String(contracts)} contract(s) and ${String(snapshot.layers.resolutions.length)} tension(s) into ${files.ontology}, ${String(phrases)} linkable phrase(s) into ${files.vocabulary}, ${String(references)} reference record(s) beside ${files.reference}\n`;
};
