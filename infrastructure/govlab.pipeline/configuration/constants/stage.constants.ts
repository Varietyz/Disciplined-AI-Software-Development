import { relativePath } from "@ssot/paths";

export const QUALITY_ENTRYPOINTS = relativePath("govlab.quality.entrypoints");

export const DOCS_ENTRYPOINTS = relativePath("govlab.docs.entrypoints");

export const CONTEXT_ENTRYPOINTS = relativePath("govlab.context.entrypoints");

export const PATTERNS_ENTRYPOINTS = relativePath("govlab.patterns.entrypoints");

export const STATS_ENTRYPOINTS = `${relativePath("govlab.stats")}/runtime/entrypoints`;

export const SCRIPT_ENTRYPOINTS = `${relativePath("project.scripts")}/runtime/entrypoints`;

export const BUILD_ENTRYPOINTS = `${relativePath("app.build")}/runtime/entrypoints`;

export const CONTENT_ENTRYPOINTS = `${relativePath("app.content")}/runtime/entrypoints`;

export const SOCIAL_ENTRYPOINTS = `${relativePath("app.social")}/runtime/entrypoints`;

export const CODEMOD_ENTRYPOINTS = `${relativePath("govlabHost.codemods")}/entrypoints`;

export const CODEMOD_VALIDATORS = `${relativePath("govlabHost.codemods")}/validators`;

export const RULE_ENTRYPOINTS = `${relativePath("govlabHost.root")}/rules/entrypoints`;

export const VITEST_COMMAND = `vitest run --config ${relativePath("codebase.testing")}/vitest.config.ts --reporter=default --reporter=json --outputFile.json=${relativePath("govlabHost.reports.lint.test")}`;

export const LOCKFILE_COMMAND =
    "lockfile-lint --path package-lock.json --type npm --allowed-hosts npm --validate-https --validate-integrity";

export const MOCKS_MARKER = "__mocks__";

export const GATE_LABEL = "verify-codebase";

export const ESLINT_GLOB = "**/*.{ts,mts,cts,json}";

export const SPELLING_EXTENSIONS: readonly string[] = [".ts", ".md", ".json"];

export const DOCUMENT_SPELLING_ROOTS: readonly string[] = [
    relativePath("docArch.root"),
    relativePath("claude.root"),
    relativePath("claudePolicy"),
];

export const TSCONFIG = "tsconfig.json";

export const APP_ID = "app";

export const MEMBER_MANIFEST = "_manifest.json";

export const SELF_GOVERNED_KEY = "selfGoverned";

export const PACKAGE_FILE = "package.json";

export const SCRIPTS_KEY = "scripts";

export const DELEGATED_SCRIPTS: readonly (readonly [string, string])[] = [
    ["checker", "Govern"],
    ["tests", "Test"],
];

export const LIST_SEPARATOR = ",";

export const MESSAGE_SEPARATOR = "\n";

export const COMMAND_JOIN = "  &&  ";

export const MS_PER_SECOND = 1000;

export const DURATION_DECIMALS = 1;

export const NUMBER_LOCALE = "en-US";

export const GATE_FLAGS = {
    bypass: "--bypass",
    member: "--member",
    only: "--only",
    report: "--report",
    run: "--run",
    skipTag: "--skip-tag",
    tag: "--tag",
} as const;
