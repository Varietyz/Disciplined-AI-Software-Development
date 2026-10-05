import type { AlgoGrammar } from "#types/algorithm.types";
import type { ArchRelations } from "#types/architecture.types";
import type { Lexicon } from "#types/lexicon.types";
import type { PagGrammar } from "#types/grammar.types";
import type { ReasonOntology } from "#types/reason.types";
import { isObject } from "#core/predicates/record.predicate";
import { unbuiltCollection } from "#configuration/strings/ontology.strings";

export const isArchRelations = function isArchRelations(value: unknown): value is ArchRelations {
    return isObject(value) && "resolve" in value && "validateOntology" in value;
};

export const isAlgoGrammar = function isAlgoGrammar(value: unknown): value is AlgoGrammar {
    return isObject(value) && "resolveClosure" in value;
};

export const isPagGrammar = function isPagGrammar(value: unknown): value is PagGrammar {
    return isObject(value) && "contextFor" in value;
};

export const isLexicon = function isLexicon(value: unknown): value is Lexicon {
    return isObject(value) && "resolve" in value && !("validateOntology" in value);
};

export const isReasonOntology = function isReasonOntology(value: unknown): value is ReasonOntology {
    return isObject(value) && "derivationLoop" in value;
};

export const requireFace = function requireFace<T>(
    value: unknown,
    guard: (candidate: unknown) => candidate is T,
    name: string,
): T {
    if (!guard(value)) {
        throw new Error(unbuiltCollection(name));
    }
    return value;
};
