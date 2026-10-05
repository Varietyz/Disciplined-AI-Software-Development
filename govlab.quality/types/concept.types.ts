export interface ConceptDefinition {
    id: string;
    dimension: string;
    cwe: string[];
    exclude: string[];
    phrases: string[];
    words: string[];
}
