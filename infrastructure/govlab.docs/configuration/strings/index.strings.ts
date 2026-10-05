export const GROUP_ROLES = {
    application: "the application — the governed subject",
    tooling: "the govlab tooling that governs this monorepo",
    unclassified: "(unclassified group)",
} as const;

export const INDEX_HEADINGS = {
    composition: "## What can work together",
    concerns: "## Concerns ownership",
    dependencies: "## Dependency graph (composing packages)",
    groups: "## Groups",
    inventory: "## Per-package inventory",
    reproduce: "## Reproducing this file",
    title: "# Workspace Index",
    tree: "## Workspace tree",
} as const;

export const INDEX_TEXT = {
    composeIntro: "Direct composition (a composing package pulls all the leaves below it):",
    concernsNote:
        "_One concern per package; if two rows look like they collide, one is misplaced or the wrong package is consuming the other._",
    noComposers: "_(no composing packages yet — all leaves)_",
    standaloneIntro: "Standalone use (any leaf can be consumed without dragging in its framework):",
    treeRoot: "banes-lab/",
} as const;

export const INDEX_TABLES = {
    concerns: ["| Concern | Owner |", "|---|---|"],
    groups: ["| Group | Role | Packages |", "|---|---|---|"],
    inventory: ["| Package | Group | Sibling deps | Surface | Source files | LOC |", "|---|---|---|---|---|---|"],
} as const;

export const reproduceNote = function reproduceNote(entrypoint: string): string {
    return `This file is regenerated from \`${entrypoint}\` (\`npm run docs:generate\`). The script expands the root \`package.json\` \`workspaces\` globs, parses each \`package.json\`, extracts the README "What is it" paragraph, counts barrel exports in \`index.ts\`, and tallies non-blank source LOC. The machine-readable peer of this file is \`INDEX.generated.json\`.`;
};

export const composesPeers = function composesPeers(count: number): string {
    return ` ← composes ${count} peers`;
};

export const inventoryRow = function inventoryRow(parts: {
    exports: number;
    group: string;
    loc: number;
    name: string;
    siblings: string;
    sources: number;
}): string {
    return `| \`${parts.name}\` | ${parts.group} | ${parts.siblings} | ${parts.exports} exports | ${parts.sources} | ${parts.loc} |`;
};

export const concernRow = function concernRow(concern: string, name: string): string {
    return `| ${concern} | \`${name}\` |`;
};

export const groupRow = function groupRow(group: string, role: string, count: number): string {
    return `| \`${group}\` | ${role} | ${count} |`;
};

export const indexSummary = function indexSummary(parts: {
    composers: number;
    exports: number;
    leaves: number;
    loc: number;
    packages: number;
}): string {
    return `**${parts.packages} packages** — ${parts.leaves} leaves, ${parts.composers} composers, **${parts.exports} barrel exports**, **${parts.loc} non-blank source LOC**.`;
};

export const composeLine = function composeLine(name: string, peers: string): string {
    return `- Use \`${name}\` to get \`${peers}\` already wired together.`;
};

export const standaloneLine = function standaloneLine(name: string, purpose: string): string {
    return `- \`${name}\` — ${purpose}`;
};

export const regeneratedIndex = function regeneratedIndex(markdown: string, json: string): string {
    return `index: regenerated ${markdown} / ${json}`;
};

export const upToDate = function upToDate(markdown: string): string {
    return `index: ${markdown} up to date`;
};

export const wroteFile = function wroteFile(file: string): string {
    return `Wrote ${file}`;
};

export const indexedCount = function indexedCount(packages: number, groups: number): string {
    return `Indexed ${packages} packages across ${groups} groups.`;
};
