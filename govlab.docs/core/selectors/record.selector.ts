import type { Manifest } from "#types/readme.types";
import { isPlainRecord } from "#core/predicates/record.predicate";

export const recordField = function recordField(record: Manifest, key: string): Manifest | null {
    const value = record[key];
    return isPlainRecord(value) ? value : null;
};

export const stringField = function stringField(record: Manifest, key: string): string | null {
    const value = record[key];
    return typeof value === "string" ? value : null;
};

export const arrayField = function arrayField(record: Manifest, key: string): unknown[] {
    const value = record[key];
    return Array.isArray(value) ? value : [];
};

export const stringsOf = function stringsOf(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
};

export const isNonEmptyStringArray = function isNonEmptyStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((entry) => typeof entry === "string" && entry.trim().length > 0);
};
