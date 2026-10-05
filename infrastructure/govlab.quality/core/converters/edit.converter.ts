import type { CuratedApplyResult, CuratedResult, CuratedSuggestion, RangeFix } from "#types/edit.types";
import { CURATED_SUGGESTIONS } from "#configuration/constants/eslint.constants";
import type { Linter } from "eslint";

const entryFor = function entryFor(message: Linter.LintMessage): CuratedSuggestion | null {
    return (
        CURATED_SUGGESTIONS.find(
            (entry) =>
                message.ruleId === entry.ruleId && (entry.messageId === null || message.messageId === entry.messageId),
        ) ?? null
    );
};

const chosenFix = function chosenFix(message: Linter.LintMessage, entry: CuratedSuggestion): RangeFix | null {
    const suggestions = message.suggestions ?? [];
    if (entry.pick === "sole") {
        const [only] = suggestions;
        return suggestions.length === 1 && only !== undefined ? { range: only.fix.range, text: only.fix.text } : null;
    }
    const picked = suggestions.find((suggestion) => suggestion.fix.text.trimStart().startsWith(entry.prefix));
    return picked === undefined ? null : { range: picked.fix.range, text: picked.fix.text };
};

const overlaps = function overlaps(a: RangeFix, b: RangeFix): boolean {
    return a.range[0] < b.range[1] && b.range[0] < a.range[1];
};

const applyRangeFixes = function applyRangeFixes(source: string, fixes: readonly RangeFix[]): string {
    const applied: RangeFix[] = [];
    let out = source;
    for (const fix of fixes.toSorted((a, b) => b.range[0] - a.range[0])) {
        if (!applied.some((prior) => overlaps(prior, fix))) {
            applied.push(fix);
            out = out.slice(0, fix.range[0]) + fix.text + out.slice(fix.range[1]);
        }
    }
    return out;
};

export const applyCuratedSuggestions = function applyCuratedSuggestions(
    result: CuratedResult,
    source: string,
): CuratedApplyResult | null {
    const consumed = new Set<Linter.LintMessage>();
    const fixes: RangeFix[] = [];
    for (const message of result.messages) {
        const entry = entryFor(message);
        const fix = entry === null ? null : chosenFix(message, entry);
        if (fix !== null) {
            fixes.push(fix);
            consumed.add(message);
        }
    }
    if (fixes.length === 0) {
        return null;
    }
    result.messages = result.messages.filter((message) => !consumed.has(message));
    result.errorCount -= consumed.size;
    return { appliedCount: consumed.size, output: applyRangeFixes(source, fixes) };
};
