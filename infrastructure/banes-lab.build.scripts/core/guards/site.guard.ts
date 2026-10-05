import type { BuiltOntology } from "#types/ontology.types";
import type { SiteState } from "#types/site.types";
import { missingOntology } from "#configuration/strings/site.strings";

export const ontologyOf = function ontologyOf(state: SiteState, step: string): BuiltOntology {
    if (state.ontology === null) {
        throw new Error(missingOntology(step));
    }
    return state.ontology;
};
