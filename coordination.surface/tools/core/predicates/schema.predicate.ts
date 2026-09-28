import type { CorpusMove } from "../types/corpus.types.ts";

export const isObject = function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const isStringMap = function isStringMap(value: unknown): value is Record<string, string> {
    if (!isObject(value)) {
        return false;
    }
    for (const item of Object.values(value)) {
        if (typeof item !== "string") {
            return false;
        }
    }
    return true;
};

export const hasFields = function hasFields(
    value: unknown,
    fields: readonly string[],
): value is Record<string, unknown> {
    if (!isObject(value)) {
        return false;
    }
    for (const field of fields) {
        if (!(field in value)) {
            return false;
        }
    }
    return true;
};

export const isCorpusMoveList = function isCorpusMoveList(value: unknown): value is CorpusMove[] {
    if (!Array.isArray(value)) {
        return false;
    }
    for (const item of value) {
        if (!hasFields(item, ["from", "to", "facet", "key", "variant"])) {
            return false;
        }
        if (typeof item["from"] !== "string" || typeof item["to"] !== "string") {
            return false;
        }
        if (typeof item["facet"] !== "string" || typeof item["key"] !== "string") {
            return false;
        }
    }
    return true;
};
