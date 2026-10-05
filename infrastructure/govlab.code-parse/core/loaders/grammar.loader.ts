import { GRAMMAR_SUFFIX } from "#configuration/constants/grammar.constants";
import { readdirSync } from "node:fs";
import { resolveGrammarDir } from "#core/resolvers/grammar.resolver";

export const availableLanguages = function availableLanguages(): string[] {
    return readdirSync(resolveGrammarDir())
        .filter((name) => name.endsWith(GRAMMAR_SUFFIX))
        .map((name) => name.slice(0, name.length - GRAMMAR_SUFFIX.length))
        .sort((a, b) => a.localeCompare(b));
};
