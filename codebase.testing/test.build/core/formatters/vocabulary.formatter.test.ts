import { describe, expect, it } from "vitest";
import { createGovlabContext } from "@govlab/context";
import { renderVocabulary } from "@banes-lab/build-scripts/core/formatters/vocabulary.formatter.ts";
import { vocabularyOf } from "@banes-lab/build-scripts/core/converters/vocabulary.converter.ts";

describe("renderVocabulary", () => {
    it("emits a module whose one export parses back to the same entries", () => {
        const vocabulary = vocabularyOf(createGovlabContext());
        const source = renderVocabulary(vocabulary);
        expect(source.startsWith('import type { VocabularyEntry } from "#types/vocabulary.types";')).toBe(true);
        const start = source.indexOf("JSON.parse(") + "JSON.parse(".length;
        const end = source.lastIndexOf(");");
        const literal: unknown = JSON.parse(source.slice(start, end));
        const parsed: unknown = JSON.parse(String(literal));
        expect(parsed).toStrictEqual(vocabulary);
    });
});
