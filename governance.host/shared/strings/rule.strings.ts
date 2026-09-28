export const budgetNotNumber = function budgetNotNumber(concern: string): string {
    return `[govlab-rules] qualityMaster.concerns.${concern} is not a number. The file budget has one home, so set it there.`;
};

export const indexedLine = function indexedLine(rules: number, wrappers: number, folder: string): string {
    return `[govlab-rules] indexed ${String(rules)} local rules + ${String(wrappers)} plugin wrapper(s) → ${folder}\n`;
};

export const stylesheetIndexedLine = function stylesheetIndexedLine(rules: number, file: string): string {
    return `[govlab-rules] indexed ${String(rules)} local stylesheet rule(s) → ${file}\n`;
};

export const stylesheetRuleUnnamed = function stylesheetRuleUnnamed(label: string, ruleName: string): string {
    return `[govlab-rules] the stylesheet rule ${label} does not default-export createPlugin("${ruleName}", rule). Name the rule for its file.`;
};

export const markersLine = function markersLine(count: number, file: string): string {
    return `[govlab-rules] derived ${String(count)} exclusion marker(s) → ${file}\n`;
};

export const budgetLine = function budgetLine(budget: number, file: string): string {
    return `[govlab-rules] derived the file budget (${String(budget)}) → ${file}\n`;
};

export const checksLine = function checksLine(count: number, file: string): string {
    return `[govlab-rules] indexed ${String(count)} check declaration(s) → ${file}\n`;
};

export const unreadableDeclaration = function unreadableDeclaration(file: string, callee: string): string {
    return `[govlab-rules] ${file} calls ${callee} with an argument the index cannot read. Pass one object literal whose detects and enforces are arrays of string literals.`;
};
