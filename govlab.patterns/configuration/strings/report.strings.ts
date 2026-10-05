export const REPORT_HEADINGS = {
    distribution: "Syntax invariants &amp; variants",
    findings: "Findings",
    nested: "Nested concerns &middot; drill down",
    symbols: "Definitions &middot; call flow",
} as const;

export const NESTED_COLUMNS: readonly string[] = ["concern", "nodes", "defs", "flagged"];

export const SYMBOL_COLUMNS: readonly string[] = ["definition", "flow", "in", "out", "dependents"];

export const SYNTAX_COLUMNS: readonly string[] = ["syntax kind", "frequency", "n"];

export const NO_DEFINITIONS = "No definitions here.";

export const RARE_ROW = "rare (once)";

export const DEPTH_PREFIX = "depth ";

export const INSPECT_HINT = String.raw`click a hex to inspect \u00b7 scroll to zoom \u00b7 drag to pan \u00b7 double-click to reset`;

export const nestedCount = function nestedCount(count: number): string {
    return ` &middot; ${count} nested concerns`;
};

export const summaryLine = function summaryLine(definitions: number, flagged: number, nested: string): string {
    return `${definitions} definitions &middot; ${flagged} findings${nested}`;
};

export const nestedTip = function nestedTip(rel: string, count: number, defs: number, findings: number): string {
    return `${rel}  ·  ${count} nodes  ·  ${defs} defs  ·  ${findings} findings`;
};

export const pageLabel = function pageLabel(title: string, rel: string): string {
    return `${title} / ${rel}`;
};

export const REPORT_ARGV_SUMMARY =
    "Generate, or with --check verify and heal, every module's report artifacts, SVG collection and master findings.";

export const REPORT_FLAGS = {
    all: "cover every discovered module instead of one",
    check: "verify the written artifacts against a fresh generation and heal drift",
    fast: "skip the cross-module context when reporting one module",
    ignore: "extra folder names to prune, as a comma-separated list",
} as const;

export const MODULE_POSITIONAL = "the module folder to report on, the working folder when absent";

export const HEAL_NOTES = {
    clean: "up to date",
    drift: "drift",
    healed: "self-healed",
    rewritten: "regenerated",
} as const;

export const healNote = function healNote(note: string): string {
    return `[hex] ${note}\n`;
};

export const moduleWritten = function moduleWritten(title: string, count: number): string {
    return `[hex] ${title}: ${count} artifact(s)\n`;
};

export const writeSummary = function writeSummary(regenerated: number, total: number): string {
    return `[hex] regenerated ${regenerated}, skipped ${total - regenerated} of ${total} module(s)\n`;
};

export const moduleDrift = function moduleDrift(moduleDir: string): string {
    return `[hex] non-deterministic drift in ${moduleDir}: the generator produced differing output across clean re-parses\n`;
};

export const healedModules = function healedModules(names: readonly string[]): string {
    return `[hex] self-healed ${names.length} transient-parse module(s): ${names.join(", ")}\n`;
};

export const rewrittenModules = function rewrittenModules(names: readonly string[]): string {
    return `[hex] regenerated ${names.length} stale module(s): ${names.join(", ")}\n`;
};

export const driftModules = function driftModules(names: readonly string[]): string {
    return `[hex] non-deterministic drift in ${names.length} module(s): ${names.join(", ")}. The generator produced differing output across clean re-parses\n`;
};

export const modulesClean = function modulesClean(total: number): string {
    return `[hex] ${total} module(s) up to date\n`;
};

export const svgCollection = function svgCollection(written: number, pruned: number, svgDir: string): string {
    return `[hex] svg collection: ${written} written, ${pruned} pruned, in ${svgDir}\n`;
};

export const masterWritten = function masterWritten(masterPath: string): string {
    return `[hex] master findings: ${masterPath}\n`;
};

export const unreadableManifest = function unreadableManifest(path: string, reason: string): string {
    return `[hex] skipping unreadable ${path}: ${reason}\n`;
};
