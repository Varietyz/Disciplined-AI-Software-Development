export const commandOf = function commandOf(entrypoint: string): string {
    return `node ${entrypoint}`;
};

export const CATALOG_SUMMARY =
    "Regenerate the quality-rule catalog: refresh the workspace's own rule producers and any named producers, then derive every catalog output.";

export const RULES_FLAG = "Comma-separated producer names whose rule catalogs to refresh, or all.";

export const KNOBS_FLAG = "Comma-separated producer names whose tool knobs to refresh, or all.";

export const COMMENT_SUMMARY = "Strip or extract source comments across a tree.";

export const MODE_FLAG = "strip, extract or keep. strip is the default.";

export const OUT_FLAG = "The JSON file extracted comments are appended to.";

export const IGNORE_FLAG = "Comma-separated exclusion markers added to the master exclusion list.";

export const ROOT_POSITIONAL = "The tree to walk. The working directory is the default.";

export const TARGET_SUMMARY = "Hold every tsconfig and jsconfig target and lib to the enforced ECMAScript release.";

export const FIX_FLAG = "Bump the stale target and lib tokens instead of reporting them.";

export const ACCESS_SUMMARY = "Rewrite dot access on index signatures to bracket access, from the TS4111 diagnostics.";

export const PROJECTS_POSITIONAL = "The tsconfig files to check. tsconfig.json is the default.";

export const VALIDATION_SUMMARY = "Run the project validators over a source tree and print the quality-gate panel.";

export const VALIDATION_ROOT = "The source tree the validators read.";

export const CANON_SUMMARY = "Report canon defects across the ontology, and fail on any with --strict.";

export const STRICT_FLAG = "Exit non-zero when any canon defect remains.";

export const accessHeading =
    "\nFix index-signature access — convert dot access on index signatures to bracket access\n\n";

export const accessLine = function accessLine(project: string, fixed: number): string {
    return `  ${project} — ${String(fixed)} converted\n`;
};

export const accessTotal = function accessTotal(total: number): string {
    return `\n${String(total)} index-signature accesses bracketed.\n\n`;
};

export const failureLine = function failureLine(label: string, detail: string): string {
    return `${label}: ${detail}\n`;
};
