import { isRecord } from "@banes-lab/content/core/selectors/payload.selector.ts";

export { isRecord, textAt } from "@banes-lab/content/core/selectors/payload.selector.ts";

export const numberAt = function numberAt(source: Record<string, unknown>, key: string): number | null {
    const value = source[key];
    return typeof value === "number" ? value : null;
};

export const recordAt = function recordAt(
    source: Record<string, unknown>,
    key: string,
): Record<string, unknown> | null {
    const value = source[key];
    return isRecord(value) ? value : null;
};

export const entriesAt = function entriesAt(source: Record<string, unknown>, key: string): unknown[] {
    const value = source[key];
    return Array.isArray(value) ? value : [];
};
