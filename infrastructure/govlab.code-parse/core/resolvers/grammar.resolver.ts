import { GRAMMAR_SUFFIX, RUNTIME_SPECIFIER } from "#configuration/constants/grammar.constants";
import { absolutePath } from "@ssot/paths";
import { createRequire } from "node:module";
import { join } from "node:path";

export const runtimeWasm = function runtimeWasm(): string {
    return createRequire(absolutePath("govlab.utils.codeParse.generated")).resolve(RUNTIME_SPECIFIER);
};

export const resolveGrammarDir = function resolveGrammarDir(): string {
    return absolutePath("govlab.utils.codeParse.generated");
};

export const grammarPath = function grammarPath(grammarDir: string, language: string): string {
    return join(grammarDir, `${language}${GRAMMAR_SUFFIX}`);
};
