export const NO_TREE = "tree-sitter produced no tree for source";

export const PARSE_FAILED = "tree-sitter failed to parse source";

export const PARSE_INCOMPLETE = "tree-sitter parse did not span full source after retries";

export const notPreloaded = function notPreloaded(language: string): string {
    return `@govlab/code-parse: language "${language}" is not preloaded. Call ensureLanguages([...]) before parseCodeSync.`;
};

export const noGrammar = function noGrammar(language: string): string {
    return `no tree-sitter grammar for language "${language}"`;
};
