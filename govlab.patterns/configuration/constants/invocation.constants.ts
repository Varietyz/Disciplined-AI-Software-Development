export const ENTRYPOINT_FILES = {
    axis: "axis.entrypoint.ts",
    pattern: "pattern.entrypoint.ts",
    report: "report.entrypoint.ts",
} as const;

export const PATTERN_FLAG_NAMES = {
    count: "--count",
    mapping: "--mapping",
    output: "--output",
    schema: "--schema",
    seed: "--seed",
    window: "--window",
} as const;

export const REPORT_FLAG_NAMES = { all: "--all", check: "--check", fast: "--fast", ignore: "--ignore" } as const;

export const COMMANDS = {
    analyze: "analyze",
    inspect: "inspect",
    plan: "plan",
    synthesize: "synthesize",
    validate: "validate",
} as const;

export const NO_CACHE_ENV = "GOVLAB_NO_CACHE";

export const NO_CACHE_ON = "1";

export const LIST_SEPARATOR = ",";

export const JSON_INDENT = 4;

export const DEFAULT_SYNTH_COUNT = 10;

export const SNAPSHOT_DIR = "snapshots";

export const DEFAULT_RESULTS = "pattern-results.generated.json";

export const FAILURE_EXIT = 1;
