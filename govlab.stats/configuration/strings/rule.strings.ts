export const oxlintConfiguration = function oxlintConfiguration(categories: number, tuned: number): string {
    return `${String(categories)} categories at error · ${String(tuned)} tuned`;
};

export const jscpdConfiguration = function jscpdConfiguration(
    threshold: number,
    tokens: number,
    lines: number,
): string {
    return `threshold ${String(threshold)}% · minTokens ${String(tokens)} · minLines ${String(lines)}`;
};

export const knipConfiguration = function knipConfiguration(workspaces: number, ignored: number): string {
    return `${String(workspaces)} workspaces · ${String(ignored)} ignored deps`;
};

export const prettierConfiguration = function prettierConfiguration(
    options: number,
    overrides: number,
    width: number,
): string {
    return `${String(options)} options · ${String(overrides)} overrides · printWidth ${String(width)}`;
};
