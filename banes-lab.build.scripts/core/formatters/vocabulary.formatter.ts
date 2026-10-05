import type { VocabularyEntry } from "@banes-lab/web/types/vocabulary.types.js";

export const renderVocabulary = function renderVocabulary(vocabulary: readonly VocabularyEntry[]): string {
    return [
        'import type { VocabularyEntry } from "#types/vocabulary.types";',
        "",
        `export const VOCABULARY: readonly VocabularyEntry[] = JSON.parse(${JSON.stringify(JSON.stringify(vocabulary))});`,
        "",
    ].join("\n");
};
