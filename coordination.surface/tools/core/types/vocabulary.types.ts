export interface Declared {
    readonly axis: string;
    readonly value: string;
    readonly line: number;
}

export interface OffVocabulary {
    readonly target: string;
    readonly declared: Declared;
    readonly closed: readonly string[];
}
