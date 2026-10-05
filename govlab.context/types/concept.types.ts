export interface Concept {
    readonly id: string;
    readonly home: string;
    readonly members: readonly string[];
}

export interface UnresolvedConceptRef {
    concept: string;
    ref: string;
}

export interface VariantId {
    canonical: string;
    collection: string;
    id: string;
}

export interface PatternVocabulary {
    readonly analysis: readonly string[];
    readonly mathTypes: readonly string[];
    readonly ontology: readonly string[];
    readonly reasoning: readonly string[];
    readonly representation: readonly string[];
}
