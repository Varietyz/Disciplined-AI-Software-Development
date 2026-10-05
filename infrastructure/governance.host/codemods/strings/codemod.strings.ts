export const VOCABULARY_SUMMARY =
    "Replaces renamed ontology names in strings and prose, keeping each word's case: a collection id inside a reference, an anchor, a catalog path or a collection name, and a renamed word as a whole word. Words joined by an underscore or a hyphen are left as written.";

export const LITERAL_SUMMARY =
    "Replaces exact text matches under the given roots. A JSON file whose rewrite would not parse is left unchanged.";

export const BUILD_SCOPE_LABEL = "ontology records the build reads";

export const SITE_SCOPE_LABEL = "ontology views the site reads";

export const syntaxRefusal = function syntaxRefusal(file: string): string {
    return `codemod refused to write ${file}: the rewrite introduced a syntax error, so the file was left unchanged.`;
};

export const refusedLine = function refusedLine(reason: string): string {
    return `REFUSED: ${reason}\n`;
};

export const ROOT_REQUIRED = "at least one --root is required, so the run's reach is declared";

export const EXTENSION_REQUIRED = "at least one --ext is required, so the file types the run rewrites are declared";

export const UNPAIRED_FROM = "every --from needs one --to at the same position";

export const EMPTY_FROM = "an empty --from matches everywhere";

export const CONVERTIBLE = "convertible";

export const DEFAULT_SCOPE_NOUN = "program(s)";

export const mapLine = function mapLine(location: string, label: string, reason: string): string {
    return `${location}\t${label}\t${reason}`;
};

export const blockedLine = function blockedLine(location: string, ruleId: string, message: string): string {
    return `${location} [${ruleId}] ${message}`;
};

export const gatedLine = function gatedLine(line: string): string {
    return `✖ ${line}`;
};

export const noteLine = function noteLine(line: string): string {
    return `  ${line}`;
};

export const appliedLine = function appliedLine(
    ruleId: string,
    applied: number,
    noun: string,
    programs: string,
    scope: string,
): string {
    return `${ruleId}: applied ${String(applied)} ${noun} across ${programs} ${scope}`;
};

export const handFixLine = function handFixLine(ruleId: string, count: number): string {
    return `${ruleId}: ${String(count)} finding(s) cannot be applied automatically, so resolve them by hand`;
};

export const leftAsWrittenLine = function leftAsWrittenLine(ruleId: string, count: number): string {
    return `${ruleId}: ${String(count)} construct(s) left as written. Each is correct as it stands, and only a mechanical rewrite is unavailable.`;
};

export const missingTarget = function missingTarget(specifier: string, name: string): string {
    return `'${specifier}' resolves to no file, and no file in its member is named '${name}'. Point the import at the file's new location or remove it.`;
};

export const ambiguousTarget = function ambiguousTarget(specifier: string, candidates: readonly string[]): string {
    return `'${specifier}' resolves to no file, and several files in its member carry its name: ${candidates.join(", ")}. Point the import at the intended file.`;
};

export const WORD_SUMMARY =
    "Replaces British spellings with American ones in whole words, keeping each word's case. Identifiers joined by an underscore or a hyphen are left as written.";

export const spellingHit = function spellingHit(american: string, key: string): string {
    return `a British spelling, whose American form is "${american}". Run the spelling codemod without --check to rewrite it, or add the file to the "${key}" entry of qualityMaster.toolExclude when the spelling is quoted.`;
};
