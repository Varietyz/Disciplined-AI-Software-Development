export const PROFILE_ID_TO_ECOSYSTEM: Readonly<Record<string, string>> = {
    arm: "iac",
    cloudformation: "iac",
    github_actions: "actions",
    kubernetes: "iac",
    terraform: "iac",
};

export const DEFAULT_PATHS: Readonly<Record<string, readonly string[]>> = {
    actions: [],
    ansible: ["."],
    clojure: ["."],
    cpp: ["**/*.{cpp,cc,cxx,hpp,hh}"],
    csharp: ["."],
    css: ["**/*.{css,scss}"],
    dockerfile: ["**/Dockerfile", "**/*.dockerfile"],
    elixir: ["."],
    go: ["./..."],
    html: ["**/*.html"],
    iac: ["."],
    java: ["."],
    javascript: ["**/*.{js,jsx,cjs,mjs}"],
    json: ["**/*.json"],
    kotlin: ["."],
    lua: ["."],
    perl: ["."],
    php: ["**/*.php"],
    python: ["."],
    r: ["."],
    ruby: ["."],
    rust: ["."],
    scala: ["."],
    shell: ["**/*.sh"],
    solidity: ["."],
    sql: ["**/*.sql"],
    swift: ["."],
    typescript: ["**/*.{ts,tsx,cts,mts}"],
    yaml: ["."],
};

export const FALLBACK_PATHS: readonly string[] = ["."];

export const CURRENT_DIRECTORY = ".";

export const POSITION = 1;

export const COLUMN_BASE = 1;

export const UNKNOWN_STATUS = -1;

export const STDERR_TAIL = 3;

const MEGABYTE = 1024 * 1024;

export const OUTPUT_LIMIT = 256 * MEGABYTE;

export const LOCATION_SEGMENTS = 2;

export const NOT_FOUND_CODE = "ENOENT";

export const MODULE_MISSING_CODES: ReadonlySet<string> = new Set(["ERR_MODULE_NOT_FOUND", "MODULE_NOT_FOUND"]);

export const ADAPTER_SUFFIX = ".adapter.ts";

export const GO_MODULE = "go.mod";

export const CARGO_MANIFEST = "Cargo.toml";

export const NPM_MANIFEST = "package.json";

export const CONCEPT_TO_PRETTIER_OPTION: ReadonlyMap<string, string> = new Map([
    ["line-length", "printWidth"],
    ["spacing", "tabWidth"],
]);

export const PRETTIER_DEFAULTS: Readonly<Record<string, unknown>> = {
    arrowParens: "always",
    bracketSpacing: true,
    endOfLine: "lf",
    objectWrap: "collapse",
    printWidth: 120,
    quoteProps: "as-needed",
    semi: true,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "es5",
    useTabs: false,
};

export const SUCCESS_STATUSES: ReadonlySet<number> = new Set([0]);

export const FINDING_STATUSES: ReadonlySet<number> = new Set([0, 1]);
