export const ENTRYPOINT_FILES = {
    coverage: "coverage.entrypoint.ts",
    document: "document.entrypoint.ts",
    index: "index.entrypoint.ts",
    invocation: "invocation.entrypoint.ts",
    manifest: "manifest.entrypoint.ts",
    package: "package.entrypoint.ts",
    readme: "readme.entrypoint.ts",
    system: "system.entrypoint.ts",
} as const;

export const FLAG_NAMES = {
    all: "--all",
    catalog: "--catalog",
    check: "--check",
    concern: "--concern",
    docSummary: "--summary",
    fix: "--fix",
    form: "--form",
    generate: "--generate",
    list: "--list",
    member: "--member",
    name: "--name",
    new: "--new",
    only: "--only",
    status: "--status",
    strict: "--strict",
    subject: "--subject",
    type: "--type",
    validate: "--validate",
    workspaceMapOnly: "--workspace-map-only",
    write: "--write",
} as const;

export const TEMPLATE_FLAG_KEYS = [
    "type",
    "form",
    "concern",
    "member",
    "subject",
    "name",
    "docSummary",
    "status",
] as const satisfies readonly (keyof typeof FLAG_NAMES)[];

export const NO_CACHE_ENV = "GOVLAB_NO_CACHE";
export const NO_CACHE_ON = "1";
export const LIST_SEPARATOR = ",";
export const FAILURE_EXIT = 1;
export const RESERVED_SLOTS = 2;
export const MIN_CONCURRENCY = 1;
export const MAX_CONCURRENCY = 16;
export const JOB_TIMEOUT_MS = 600_000;
export const LIST_TIMEOUT_MS = 120_000;
export const ERROR_PREVIEW_LEN = 300;
export const WORKSPACE_MAP_ID = "workspace-map";
export const DOC_HEAL_ATTEMPTS = 4;
export const DOCS_CACHE_NAME = "module-docs";
