import type { Identity } from "#types/catalog.types";

export interface SearchSection {
    readonly href: string;
    readonly position: number;
    readonly words: readonly string[];
}

export interface SearchEntry {
    readonly identity: Identity;
    readonly position: number | null;
    readonly words: readonly string[];
}

export interface SearchKind {
    readonly entries: readonly SearchEntry[];
    readonly kind: string;
}

export interface SearchRules {
    readonly americanWords: Readonly<Record<string, string>>;
    readonly fuzzyMinimum: number;
    readonly izeStems: readonly string[];
    readonly izeSuffixes: Readonly<Record<string, string>>;
    readonly pluralIes: readonly [string, string];
    readonly pluralKeptAfter: readonly string[];
    readonly pluralMinimum: number;
    readonly pluralSuffix: string;
    readonly spellingPrefixes: readonly string[];
    readonly wordCharacters: string;
}

export interface Phrase {
    readonly phrase: string;
    readonly ref: string;
}
