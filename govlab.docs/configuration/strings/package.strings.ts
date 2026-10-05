export const PACKAGE_TEXT = {
    undeclaredEntry:
        "declares docs but resolves no analyzable entry — add an `entries` array (use [] to declare none) or an exports target that resolves to a file",
    usage: "usage: govlab-docs <moduleDir> [--write] | --all | --check | --fix",
} as const;

export const principleFinding = function principleFinding(at: string, axis: string, detail: string): string {
    return `✖ ${at} [governance.principles] ${axis} — ${detail}`;
};

export const conceptFinding = function conceptFinding(at: string, axis: string, detail: string): string {
    return `✖ ${at} [governedBy] ${axis} — ${detail}`;
};

export const declaredDocFinding = function declaredDocFinding(
    at: string,
    doc: string,
    heading: string,
    axis: string,
    detail: string,
): string {
    return `✖ ${at} [documents.${doc}.${heading}] ${axis} ${detail}`;
};

export const docsFieldFinding = function docsFieldFinding(
    at: string,
    field: string,
    axis: string,
    detail: string,
): string {
    return `✖ ${at} [docs.${field}] ${axis} ${detail}`;
};

export const docsIncomplete = function docsIncomplete(label: string): string {
    return `✖ ${label} [docs-incomplete] generated README but manifest has no docs block`;
};

export const entryUnresolved = function entryUnresolved(at: string, pattern: string): string {
    return `✖ ${at} [entry-unresolved] "${pattern}" matches no file on disk`;
};

export const entryUndeclared = function entryUndeclared(at: string, detail: string): string {
    return `✖ ${at} [entry-undeclared] ${detail}`;
};

export const chartsStale = function chartsStale(at: string): string {
    return `✖ ${at} [charts-stale] module is not analyzable — remove the file`;
};

export const manifestMissing = function manifestMissing(dir: string): string {
    return `✖ ${dir}: workspace member without a _manifest.json — every module carries one and its README is generated from it [manifest-missing]`;
};

export const duplicatePrinciple = function duplicatePrinciple(detail: string): string {
    return `✖ @govlab/context ontology [duplicate-principle] ${detail}`;
};

export const noManifest = function noManifest(target: string): string {
    return `✖ ${target}: no _manifest.json found`;
};

export const noDocsBlock = function noDocsBlock(target: string): string {
    return `✖ ${target}: manifest has no docs block; nothing to generate`;
};

export const writtenLabel = function writtenLabel(label: string): string {
    return `✓ ${label}`;
};

export const checkSummary = function checkSummary(findings: number, healed: string): string {
    return `govlab.docs validate: ${findings} module-doc finding(s)${healed}`;
};

export const healedCount = function healedCount(count: number): string {
    return `, ${count} healed`;
};

export const generateSummary = function generateSummary(count: number): string {
    return `govlab.docs generate: ${count} module document(s)`;
};

export const WORKSPACE_MAP = {
    graphHeading: "Sibling-dependency graph",
    inventoryHeading: "Module inventory",
    lead: "Auto-generated from every workspace `_manifest.json` + `package.json`. Dotted edges are `@govlab/*` sibling dependencies; a leaf with no sibling deps appears in the inventory but not the graph.",
    summary:
        "The generated workspace dependency map and inventory — every member package, its group and maturity, and the sibling-dependency graph.",
    tableHead: ["| Module | Group | Maturity | Sibling deps |", "| --- | --- | --- | --- |"],
    title: "Workspace Dependency Map",
} as const;

export const inventoryRow = function inventoryRow(name: string, group: string, maturity: string, deps: number): string {
    return `| \`${name}\` | ${group} | ${maturity} | ${deps} |`;
};

export const mermaidFence = function mermaidFence(body: string): string {
    return `\`\`\`mermaid\n${body}\n\`\`\``;
};
