import { isRecord } from "#core/predicates/record.predicate";

export const field = function field(value: unknown, key: string): unknown {
    return isRecord(value) ? value[key] : null;
};

export const stringField = function stringField(value: unknown, key: string): string {
    const raw = field(value, key);
    return typeof raw === "string" ? raw : "";
};

export const numberField = function numberField(value: unknown, key: string, fallback: number): number {
    const raw = field(value, key);
    return typeof raw === "number" ? raw : fallback;
};

export const arrayField = function arrayField(value: unknown, key: string): unknown[] {
    const raw = field(value, key);
    return Array.isArray(raw) ? raw : [];
};

export const stringsIn = function stringsIn(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
};
