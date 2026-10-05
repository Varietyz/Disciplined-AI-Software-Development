import type { VocabularyEntry } from "#types/vocabulary.types";

export const valuesOf = function valuesOf<T extends string>(entries: readonly VocabularyEntry<T>[]): readonly T[] {
    return entries.map((entry) => entry.value);
};
