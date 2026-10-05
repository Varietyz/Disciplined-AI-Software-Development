export const FLAGS = {
    fix: "--fix",
    ignore: "--ignore",
    knobs: "--knobs",
    mode: "--mode",
    out: "--out",
    rules: "--rules",
    strict: "--strict",
} as const;

export const ENTRYPOINT_FILES = {
    access: "access.entrypoint.ts",
    canon: "canon.entrypoint.ts",
    catalog: "catalog.entrypoint.ts",
    comment: "comment.entrypoint.ts",
    target: "target.entrypoint.ts",
    validation: "validation.entrypoint.ts",
} as const;

export const COMMENT_MODES: ReadonlySet<string> = new Set(["strip", "extract", "keep"]);

export const DEFAULT_COMMENT_MODE = "strip";

export const KEEP_MODE = "keep";

export const EXTRACT_MODE = "extract";

export const LIST_SEPARATOR = ",";

export const DEFAULT_PROJECTS: readonly string[] = ["tsconfig.json"];

export const FAILURE_EXIT = 1;
