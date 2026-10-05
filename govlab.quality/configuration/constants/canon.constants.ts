export const KIND_SET: readonly string[] = Object.freeze([
    "anti-pattern",
    "principle",
    "mechanism",
    "pattern",
    "quality-attribute",
    "activity",
    "constraint",
    "style",
    "model",
    "technique",
    "approach",
    "artifact",
    "capability",
    "metric",
]);

export const OWNED_BY_VALUE_SETTINGS: ReadonlySet<string> = new Set(["line-length", "quote-style"]);

export const CONCEPT_SURFACE: ReadonlyMap<string, string> = new Map([
    ["cognitive-complexity", "complexity"],
    ["cyclomatic-complexity", "complexity"],
    ["deep-nesting", "complexity"],
    ["long-function", "complexity"],
    ["no-unused", "unused-symbols"],
    ["too-many-params", "complexity"],
]);

export const FORMAT_DIMENSION = "format";

export const LAYOUT_SURFACE = "layout";

export const TOGGLE_VALUE_TYPE = "toggle";

export const DEFAULT_PROVENANCE = "mapping-index";

export const FIDELITY_LEVELS: ReadonlySet<string> = new Set(["exact", "approximate", "advisory"]);

export const CONCEPT_PREFIX = "quality:concept:";

export const NONE_PREFIX = "none:";
