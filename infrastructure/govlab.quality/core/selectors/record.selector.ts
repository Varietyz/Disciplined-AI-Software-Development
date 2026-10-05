export const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

export const recordAt = (record: Record<string, unknown>, key: string): Record<string, unknown> => {
    const value = record[key];
    return isRecord(value) ? value : {};
};

export const recordsAt = (record: Record<string, unknown>, key: string): Record<string, unknown>[] => {
    const value = record[key];
    return Array.isArray(value) ? value.filter(isRecord) : [];
};

export const firstRecord = (records: Record<string, unknown>[]): Record<string, unknown> => records[0] ?? {};

export const stringField = (record: Record<string, unknown>, key: string, fallback = ""): string => {
    const value = record[key];
    return typeof value === "string" ? value : fallback;
};

export const numberField = (record: Record<string, unknown>, key: string, fallback: number): number => {
    const value = record[key];
    return typeof value === "number" ? value : fallback;
};

export const boolField = (record: Record<string, unknown>, key: string): boolean => record[key] === true;

export const hasField = (record: Record<string, unknown>, key: string): boolean => (record[key] ?? null) !== null;

export const arrayField = (record: Record<string, unknown>, key: string): unknown[] => {
    const value = record[key];
    return Array.isArray(value) ? value : [];
};

export const stringArrayField = (record: Record<string, unknown>, key: string): string[] =>
    arrayField(record, key).filter((entry): entry is string => typeof entry === "string");

export const stringArrayFieldOr = (
    record: Record<string, unknown>,
    key: string,
    fallback: readonly string[],
): string[] => (Array.isArray(record[key]) ? stringArrayField(record, key) : [...fallback]);

export const numericField = (record: Record<string, unknown>, key: string, fallback: number): number => {
    const value = record[key];
    const parsed = typeof value === "string" || typeof value === "number" ? Number(value) : Number.NaN;
    return parsed || fallback;
};

export const firstNumberField = (record: Record<string, unknown>, key: string, fallback: number): number => {
    const value = record[key];
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "number") {
        return value[0];
    }
    return fallback;
};
