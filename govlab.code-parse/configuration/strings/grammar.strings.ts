export const BUILD_COMMAND = "npm run build:grammars -w @govlab/code-parse --";

export const BUILD_SUMMARY =
    "Fetch every declared tree-sitter grammar, build each missing grammar to WebAssembly, and write the language extension map.";

export const NO_TARBALL = "npm pack produced no tarball";

export const UNKNOWN_FAILURE = "unknown";

export const WASM_UNBUILT_PREFIX = "wasm-unbuilt (extensions kept)";

export const SKIPPED_PREFIX = "skipped";

export const noParserSource = function noParserSource(subdir?: string): string {
    return `no src/parser.c at ${subdir ?? "<root>"}`;
};

export const noteOf = function noteOf(lang: string, reason: string): string {
    return `${lang}: ${reason}`;
};

export const builtLine = function builtLine(lang: string, fileTypes: readonly string[]): string {
    return `ok ${lang} (${fileTypes.join(",")})\n`;
};

export const wasmFailedLine = function wasmFailedLine(lang: string, reason: string): string {
    return `WASM BUILD FAILED ${lang}: ${reason}\n`;
};

export const fetchFailedLine = function fetchFailedLine(lang: string, reason: string): string {
    return `FETCH FAILED ${lang}: ${reason}\n`;
};

export const wroteLine = function wroteLine(count: number, target: string): string {
    return `\nwrote ${String(count)} language extension set(s) to ${target}\n`;
};

export const builtSummary = function builtSummary(built: readonly string[]): string {
    return `\nbuilt ${String(built.length)} grammar(s): ${built.join(" ")}\n`;
};

export const noteLine = function noteLine(prefix: string, note: string): string {
    return `${prefix} ${note}\n`;
};

export const fetchFailedNote = function fetchFailedNote(note: string): string {
    return `fetch failed ${note}\n`;
};

export const buildFailed = function buildFailed(reason: string): string {
    return `build-grammars failed: ${reason}\n`;
};
