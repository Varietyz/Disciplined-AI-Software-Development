export const README_HEADINGS = {
    aiContext: "AI context",
    api: "API",
    charts: "Architecture charts",
    concepts: "Quality governance",
    configuration: "Configuration",
    dependencies: "Dependencies",
    disposal: "Disposal",
    domains: "Domains",
    install: "Install",
    principles: "Architecture principles",
    purpose: "Purpose",
    quickStart: "Quick start",
    repository: "Repository",
    whenNotToUse: "When NOT to use",
    whenToUse: "When to use",
} as const;

export const README_SECTION_ALIASES = {
    configuration: ["Config"],
    disposal: ["Removal"],
    install: ["Installation"],
    purpose: ["What is it"],
    quickStart: ["How is it used", "Usage"],
    whenNotToUse: ["When not to use"],
    whenToUse: ["What is it for"],
} as const;

export const README_TEXT = {
    conceptsIntro:
        "The canonical quality catalog resolves the quality concepts that govern this package. `_manifest.json` declares them in `governedBy`, and a lint package derives them from the concepts its own rules enforce. Each maps to the custom lint rules that enforce it:",
    domainsIntro:
        "This package serves these software domains, which `_manifest.json` declares in `domains` from the two-tier software-domain vocabulary (`meta → sub`):",
    leaf: "The package is a leaf with no runtime dependencies.",
    noLocalPackage:
        "The package has no local `package.json`, so the workspace-root manifest declares and hoists its runtime dependencies.",
    noSurface: "The package exposes no public API.",
    principlesIntro:
        "The principle ontology resolves the architectural principles that govern this package, which `_manifest.json` declares in `governance.principles`:",
    repositoryNote: "_The generator derives this section from the repository, and the drift gate skips it._",
} as const;

export const REPO_LABELS = {
    branch: "Default branch",
    commits: "Commits",
    contributors: "Contributors",
    created: "Created",
    files: "Tracked files",
    languages: "Languages",
    lastCommit: "Last commit",
    latestTag: "Latest tag",
} as const;

export const RELATION_LABELS = {
    conflicts: "Conflicts with",
    enables: "Enables",
    reinforces: "Reinforces",
    tensions: "Tensions with",
} as const;

export const chartsNote = function chartsNote(chartsPath: string): string {
    return `The structure, logical-flow and dependency diagrams derived from the source AST live in [${chartsPath}](./${chartsPath}).`;
};

export const defaultInstall = function defaultInstall(scoped: string): string {
    return `The package is private and resolves as \`${scoped}\`. Build it with \`npm run build\`, then import from the barrel.`;
};

export const metricsLine = function metricsLine(
    exports: number,
    deps: number,
    principles: number,
    concepts: number,
): string[] {
    return [`${exports} exports`, `${deps} deps`, `${principles} principles`, `${concepts} concepts`];
};

export const exampleLabel = function exampleLabel(intent: string): string {
    return intent === "" ? " EXAMPLE:" : ` EXAMPLE: ${intent}`;
};
