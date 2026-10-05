export const targetFixed = function targetFixed(rel: string, tokens: string, replacement: string): string {
    return `  fixed  ${rel}  (${tokens} → ${replacement})\n`;
};

export const targetSummary = function targetSummary(count: number, replacement: string): string {
    return `\n[es-target] bumped ${String(count)} config(s) to ${replacement}.\n`;
};

export const targetClean = function targetClean(replacement: string): string {
    return `[es-target] all tsconfig/jsconfig target+lib are ${replacement} or newer.\n`;
};

export const targetStale = function targetStale(count: number, replacement: string): string {
    return `[es-target] ${String(count)} config(s) below ${replacement}. Run "npm run es-target:fix":\n`;
};

export const targetLine = function targetLine(rel: string, tokens: string): string {
    return `  ${rel}  →  ${tokens}\n`;
};

export const targetFatal = function targetFatal(detail: string): string {
    return `[es-target] fatal: ${detail}\n`;
};
