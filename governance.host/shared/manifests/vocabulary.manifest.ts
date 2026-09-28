import type { TermRecord } from "../../types/writing.types.ts";

export const BANNED_TERMS: readonly string[] = [
    "advanced",
    "breakthrough",
    "elegant",
    "enhanced",
    "flagship",
    "innovator",
    "leader",
    "mathematical precision",
    "novel",
    "paradigm",
    "powerful",
    "revolutionary",
    "robust",
    "seamless",
    "sophisticated",
];

export const KNOWN_VIOLATIONS: ReadonlyMap<string, string> = new Map([
    ["a human", "a developer"],
    ["a person", "a developer"],
    ["a user", "a developer"],
    ["ai prompt sprawl", "prompt sprawl"],
    ["ai safety", "model safety"],
    ["an ai", "a model"],
    ["an operator", "a developer"],
    ["planted case", "planted violation"],
    ["planted failure", "planted violation"],
    ["proof of firing", "planted violation"],
    ["the ai", "the model"],
    ["the human", "the developer"],
    ["the operator", "the developer"],
    ["the person", "the developer"],
    ["the user", "the developer"],
]);

export const LEGAL_SUBJECTS: ReadonlySet<string> = new Set(["company", "information", "license", "privacy", "terms"]);

export const PROPER_NAMES: readonly string[] = ["the operator profile"];

export const RETIRED_SYNONYMS: ReadonlyMap<string, string> = new Map([
    ["ai-assisted", "LLM-assisted on a short line, or with a model in body copy"],
    ["ai-driven", "LLM-driven on a short line, or with a model in body copy"],
    ["positive control", "planted violation or conforming member"],
]);

export const RENAMED_COLLECTIONS: ReadonlyMap<string, string> = new Map([
    ["algo", "algorithms"],
    ["algo-domain", "algorithms-domain"],
    ["arch", "architecture"],
    ["arch-category", "architecture-category"],
    ["lex", "lexicon"],
    ["lex-category", "lexicon-category"],
    ["reason", "reasoning"],
]);

export const RENAMED_WORDS: ReadonlyMap<string, string> = new Map([
    ["face", "collection"],
    ["faces", "collections"],
    ["twin", "alternate"],
    ["twins", "alternates"],
]);

export const COLLECTION_PATH_SEGMENTS: readonly string[] = ["records", "facets", "ids"];

export const HARNESS_TOKENS: readonly string[] = [
    "anthropic",
    "auto mode",
    "bash_output",
    "cell_id",
    "claude",
    "claude code",
    "kill_shell",
    "mcp",
    "mcp_execute",
    "model context protocol",
    "notebook_edit",
    "notebook_path",
    "posttooluse",
    "pretooluse",
    "settings.json",
    "settings.local.json",
    "slash command",
    "slash_command",
    "subagent_type",
    "todo_write",
];

export const NUMBERED_NOUNS: readonly string[] = [
    "chapter",
    "diagram",
    "example",
    "figure",
    "listing",
    "panel",
    "section",
    "table",
];

export const CANONICAL_TERMS: readonly TermRecord[] = [];

export const synonymsOf = function synonymsOf(terms: readonly TermRecord[]): readonly string[] {
    return terms.flatMap((term) => term.synonyms);
};

export const canonicalFor = function canonicalFor(terms: readonly TermRecord[], synonym: string): TermRecord | null {
    return terms.find((term) => term.synonyms.includes(synonym)) ?? null;
};
