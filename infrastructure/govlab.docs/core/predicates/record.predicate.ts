import type { FlatRecord, Manifest } from "#types/readme.types";

export const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

export const isPlainRecord = function isPlainRecord(value: unknown): value is Manifest {
    return isRecord(value) && !Array.isArray(value);
};

export const isRecordArray = function isRecordArray(value: unknown): value is FlatRecord[] {
    return Array.isArray(value) && value.length > 0 && value.every(isPlainRecord);
};

export const isFlatRecord = function isFlatRecord(value: unknown): value is FlatRecord {
    return (
        isPlainRecord(value) &&
        Object.keys(value).length > 0 &&
        Object.values(value).every((entry) => typeof entry === "string")
    );
};
