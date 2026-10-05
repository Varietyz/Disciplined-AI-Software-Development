import type { ExclusionReason } from "@ssot/secrets";

export const CREDENTIAL_EXTENSIONS: ReadonlySet<string> = new Set([
    ".conf",
    ".html",
    ".json",
    ".md",
    ".txt",
    ".yaml",
    ".yml",
]);

export const TOKEN_BREAKS: ReadonlySet<string> = new Set([
    " ",
    "\t",
    "\r",
    '"',
    "'",
    "`",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "<",
    ">",
    ",",
    ";",
]);

export const LINE_BREAK = "\n";

export const CREDENTIAL_EXCLUSIONS: readonly { readonly key: string; readonly reason: ExclusionReason }[] = [
    { key: "govlab.quality.catalog.data", reason: "third-party-rule-text" },
];
