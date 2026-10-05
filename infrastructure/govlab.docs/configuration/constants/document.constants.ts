import { relativePath } from "@ssot/paths";

export const DEFAULT_ROOT_PREFIX = `${relativePath("docArch")}/`;
export const HOW_TO_PREFIX = "HOW-TO-";
export const MARKDOWN_SUFFIX = ".md";
export const GENERATED_MARKER = "generated";
export const INSTALL_ARTIFACT_SUFFIX = "-INSTALL.md";
export const README_FILE = "README.md";
export const MANIFEST_FILE = "_manifest.json";
export const PACKAGE_FILE = "package.json";
export const FRONTMATTER_FENCE = "---";
export const MODULE_BARREL_KEY = "changelogs";
export const CATALOG_FILE = "catalog.generated.json";
export const BARREL_SUFFIX = ".generated.md";

export const DOC_BOUNDARY_FILENAMES: readonly string[] = [
    "README.md",
    "LICENSE",
    "LICENSE.md",
    "AI-CONTEXT.md",
    "SECURITY.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "AGENTS.md",
];

export const SPINE_KEYS: readonly string[] = ["type", "name", "summary"];

export const REFERENCE_EXTENSIONS: ReadonlySet<string> = new Set([
    ".ts",
    ".mts",
    ".cts",
    ".tsx",
    ".js",
    ".mjs",
    ".cjs",
    ".jsx",
    ".json",
    ".jsonc",
    ".md",
    ".css",
    ".go",
    ".sh",
    ".html",
    ".yml",
    ".yaml",
    ".toml",
]);

export const DRIFT_CODES = {
    chartSyntax: "chart-syntax",
    charts: "charts-drift",
    doc: "doc-drift",
    readme: "readme-drift",
} as const;

export const WORKSPACE_MAP_DOC = {
    concern: "workspace",
    member: "project",
    name: "workspace-dependency-map",
    type: "reference",
} as const;

export const DOC_STATUSES: readonly string[] = ["planned", "building", "current", "superseded"];

export const GENERATED_DOC_MARKS: readonly string[] = ["auto-generated", "do not edit"];

export const GENERATED_SCAN_LINES = 5;

export const GENERATED_SCAN_CLOSE_OFFSET = 4;
