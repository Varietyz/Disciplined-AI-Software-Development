import { isFlatRecord, isPlainRecord } from "#core/predicates/record.predicate";
import type { ApiNote } from "#types/readme.types";

export const isNonEmptyString = function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
};

export const isStringArray = function isStringArray(value: unknown): boolean {
    return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
};

const isFlatRecordArray = function isFlatRecordArray(value: unknown): boolean {
    return Array.isArray(value) && value.length > 0 && value.every(isFlatRecord);
};

export const isRenderable = function isRenderable(value: unknown): boolean {
    return isNonEmptyString(value) || isStringArray(value) || isFlatRecordArray(value);
};

export const isApiNote = function isApiNote(value: unknown): value is ApiNote {
    return isPlainRecord(value) && typeof value["note"] === "string";
};
