import type { ArchPort, ConceptRecord, Manifest, OntologyFinding } from "#types/readme.types";
import {
    ambiguousPrinciple,
    conflictingPrinciples,
    unresolvedConcept,
    unresolvedPrinciple,
} from "#configuration/strings/governance.strings";

const conflictIds = function conflictIds(id: string, arch: ArchPort, declared: ReadonlySet<string>): string[] {
    return arch
        .resolve([id])
        .edges.conflictsWith.flatMap((edge) => (typeof edge === "string" ? [] : [edge.id]))
        .filter((other) => other !== id && declared.has(other));
};

const principleFindings = function principleFindings(
    id: string,
    arch: ArchPort,
    declared: ReadonlySet<string>,
): OntologyFinding[] {
    if ((arch.get(id) ?? null) === null) {
        return [{ axis: "unresolved-principle", detail: unresolvedPrinciple(id) }];
    }
    return conflictIds(id, arch, declared).map((other) => ({
        axis: "conflicting-principles",
        detail: conflictingPrinciples(id, other),
    }));
};

export const governPrinciples = function governPrinciples(manifest: Manifest, arch: ArchPort): OntologyFinding[] {
    const principles = manifest.governance?.principles;
    const ids = Array.isArray(principles) ? principles : [];
    const declared = new Set(ids);
    return ids.flatMap((id) => principleFindings(id, arch, declared));
};

export const ontologyDuplicateFindings = function ontologyDuplicateFindings(arch: ArchPort): string[] {
    return arch.validateOntology().duplicateIds.map(ambiguousPrinciple);
};

export const governConcepts = function governConcepts(
    manifest: Manifest,
    concepts: ReadonlyMap<string, ConceptRecord>,
): OntologyFinding[] {
    const ids = Array.isArray(manifest.governedBy) ? manifest.governedBy : [];
    if (concepts.size === 0) {
        return [];
    }
    return ids
        .filter((id) => !concepts.has(id))
        .map((id) => ({ axis: "unresolved-concept", detail: unresolvedConcept(id) }));
};
