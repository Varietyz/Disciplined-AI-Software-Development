export const isObject = function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

export const isPlainRecord = function isPlainRecord(value: unknown): value is Record<string, unknown> {
    return isObject(value) && !Array.isArray(value);
};

export const isStringList = function isStringList(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
};
