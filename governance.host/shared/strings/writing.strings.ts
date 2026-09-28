export const REGISTER_HEADER: readonly string[] = [
    "# Register: how every string is written",
    "Generated from the writing canon in `.govlab/shared/manifests/writing.*.manifest.ts` by `node .govlab/rules/entrypoints/writing.entrypoint.ts`. Edit the records, never this file. `--check` fails when this file differs from the records.",
    "**Scope:** every string in every channel. The root layer holds for every string, and each layer below adds the rules for its channel. A layer's defers-to list names the files that stay the one home for a part of its channel.",
];

export const LAYER_TITLES = {
    document: "Documents",
    identifier: "Identifiers",
    note: "Notes and chat",
    output: "Tool output",
    prose: "Site prose",
    root: "Every string",
    short: "Short lines",
} as const;

export const REGISTER_MATCHES = "writing canon: the register matches the records\n";

export const recordFinding = function recordFinding(
    at: string,
    rule: string,
    check: string,
    evidence: string,
    sentence: string,
): string {
    return `✖ ${at}: the record breaks ${rule}, a ${check} finding at "${evidence}" in "${sentence}". Rewrite the record to the canon. Only the rejected text of an example keeps a violation.\n`;
};

export const documentFinding = function documentFinding(
    at: string,
    rule: string,
    check: string,
    evidence: string,
    sentence: string,
): string {
    return `✖ ${at}: the text breaks ${rule}, a ${check} finding at "${evidence}" in "${sentence}". Rewrite the sentence to the rule in the register.\n`;
};

export const registerDrift = function registerDrift(target: string): string {
    return `✖ ${target}: the register differs from the writing canon records. Run node .govlab/rules/entrypoints/writing.entrypoint.ts to render it again.\n`;
};

export const renderedLine = function renderedLine(layers: number, rules: number, target: string): string {
    return `writing canon: rendered ${String(layers)} layer(s) and ${String(rules)} rule(s) into ${target}\n`;
};

export const findingsLine = function findingsLine(records: number, documents: number): string {
    return `writing canon: ${String(records)} record finding(s), ${String(documents)} document finding(s)\n`;
};
