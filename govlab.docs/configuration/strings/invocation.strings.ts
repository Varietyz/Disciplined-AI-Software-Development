export const jobTimedOut = function jobTimedOut(label: string, timeoutMs: number): string {
    return `\n${label}: timed out after ${timeoutMs}ms\n`;
};

export const jobFailed = function jobFailed(label: string, message: string): string {
    return `\n${label}: ${message}\n`;
};

export const listFailed = function listFailed(preview: string): string {
    return `module-doc --list failed: ${preview}`;
};

export const WORKSPACE_MAP_SUFFIX = " + workspace-map";

export const chunkLabel = function chunkLabel(index: number): string {
    return `chunk ${index + 1}`;
};

export const parallelPlan = function parallelPlan(parts: {
    changed: number;
    chunks: number;
    map: string;
    mode: string;
    modules: number;
    unchanged: number;
}): string {
    return `docs-parallel (${parts.mode}): ${parts.modules} modules, ${parts.changed} to (re)generate across ${parts.chunks} chunk(s)${parts.map}, ${parts.unchanged} unchanged\n`;
};

export const parallelSummary = function parallelSummary(parts: {
    chunks: number;
    failed: number;
    map: string;
    unchanged: number;
}): string {
    return `\ndocs-parallel: ${parts.chunks} chunk(s)${parts.map}, ${parts.failed} job(s) with findings/failure, ${parts.unchanged} unchanged skipped\n`;
};

export const DOCUMENT_USAGE =
    "usage: document.entrypoint.ts --validate [--strict] | --fix | --catalog | --new --type <form> --concern <concern> --subject <subject>";

export const INVOCATION_USAGE = "usage: invocation.entrypoint.ts --validate | --fix | --new <flags> | --generate\n";

export const modeBanner = function modeBanner(mode: string, label: string): string {
    return `\n▸ docs:${mode} — ${label}\n`;
};

export const VERB_LABELS = {
    authored: "authored documents",
    catalog: "doc-arch catalog",
    manifests: "manifests",
    readmes: "module readmes + charts",
    scaffold: "scaffold document",
    system: "system architecture",
    workspace: "workspace index",
} as const;

export const INVOCATION_SUMMARIES = {
    coverage: "Report manifest completeness across every discovered module.",
    document: "Validate, fix, catalog or scaffold the authored documents under doc-arch.",
    index: "Generate the workspace index, or with --check verify and heal it.",
    invocation: "Run one documentation verb: validate, fix, new or generate.",
    manifest: "Validate every workspace _manifest.json against the manifest plugins.",
    package: "Generate, check or fix the README, typed documents and charts of manifest-bearing modules.",
    readme: "Generate or check every module's README and charts in parallel chunks.",
    system: "Generate the system architecture document, or with --check verify and heal it.",
} as const;

export const INVOCATION_FLAGS = {
    all: "generate every discovered module",
    catalog: "compile the doc-arch catalog and concern barrels",
    check: "verify generated output against a fresh generation and heal drift",
    concern: "the concern of the scaffolded document",
    docSummary: "the one-line summary of the scaffolded document",
    fix: "backtick bare paths, or heal drifted generated output",
    form: "the form of the scaffolded document, alias of --type",
    generate: "regenerate every derived document",
    list: "print every discovered module path",
    member: "the owning workspace member of the scaffolded document",
    name: "the explicit name of the scaffolded document",
    new: "scaffold a document at its computed location",
    only: "a comma-separated list of module paths to limit the run to",
    status: "the frontmatter status of the scaffolded document",
    strict: "exit non-zero when any finding remains",
    subject: "the subject tail of the scaffolded document name",
    type: "the form of the scaffolded document",
    validate: "run every documentation gate",
    workspaceMapOnly: "regenerate only the workspace dependency map",
    write: "write the README of the named module",
} as const;

export const MODULE_POSITIONAL = "the module folder whose README is generated";
