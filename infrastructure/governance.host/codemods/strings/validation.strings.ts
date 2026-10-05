export const REFERENCES_CLEAN = "path-references: clean. No markup surface names a workspace location by literal.\n";

export const referencesFailed = function referencesFailed(count: number): string {
    return `path-reference validation FAILED: ${String(count)} literal workspace location(s) outside the paths SSOT.\n\nBuild the value from \`@ssot/paths\`, or add the key to \`project.paths/paths.yaml\` when it has none. package.json and tsconfig.json are exempt, because npm and tsc read them before any of this code runs, so a literal there is the declaration itself.\n\n`;
};

export const constructGroupLine = function constructGroupLine(construct: string, count: number): string {
    return `  ${construct} (${String(count)})\n`;
};

export const referenceLine = function referenceLine(file: string, value: string, token: string): string {
    return `    ${file}  "${value}"  names '${token}'\n`;
};

export const GROUP_END = "\n";

export const noClosedScope = function noClosedScope(label: string): string {
    return `✖ closed values: FIELD_SCOPES declares no scope labeled "${label}". Declare it there.\n`;
};

export const closedValuesLine = function closedValuesLine(found: number, declared: number, undeclared: number): string {
    return `closed values: ${String(found)} closed-vocabulary value(s) reach a plain string field, ${String(declared)} declared plain, ${String(undeclared)} undeclared\n`;
};

export const plainClosedValue = function plainClosedValue(
    location: string,
    vocabulary: string,
    target: string,
): string {
    return `✖ ${location} a value of ${vocabulary} reaches ${target} as plain text, so the page cannot link it to its definition. Give the vocabulary records and pass an EdgeRef, or declare ${target} in PLAIN_CLOSED_FIELDS with its reason.\n`;
};

export const fieldReachLine = function fieldReachLine(
    label: string,
    counts: {
        readonly carried: number;
        readonly fields: number;
        readonly hidden: number;
        readonly read: number;
        readonly unread: number;
    },
): string {
    return `field reach: ${label}: ${String(counts.fields)} field(s), ${String(counts.read)} read, ${String(counts.carried)} carried, ${String(counts.hidden)} declared hidden, ${String(counts.unread)} unread\n`;
};

export const emptyScope = function emptyScope(label: string): string {
    return `✖ field reach: ${label}: the scope holds no fields, so its roots resolve to nothing\n`;
};

export const missingRoot = function missingRoot(file: string, label: string, name: string): string {
    return `✖ ${file}: the scope "${label}" names the root ${name}, and this file declares no interface by that name\n`;
};

export const UNDECLARED_HIDDEN =
    "and HIDDEN_FIELDS does not declare it. Read it, or declare it hidden with its reason.";

export const unreadCarrier = function unreadCarrier(carrier: string): string {
    return `and its carrier ${carrier} is never read either. Read the carrier, or correct CARRIED_FIELDS.`;
};

export const unreadField = function unreadField(location: string, key: string, label: string, reason: string): string {
    return `✖ ${location} ${key} is never read by the ${label}, ${reason}\n`;
};
