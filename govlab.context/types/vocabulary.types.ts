export interface VocabularyEntry<T extends string = string> {
    readonly definition: string;
    readonly value: T;
}

export interface ClosedVocabulary {
    readonly entries: readonly VocabularyEntry[];
    readonly id: string;
    readonly relation: string;
}

export type ForceKind = "anti-force" | "force" | "unknown";
