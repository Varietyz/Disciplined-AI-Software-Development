import { loadInstallRegistry } from "#core/loaders/dependency.loader";

export const MUST_BE_OBJECT = "must be an object";

export const isObject = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value);

export const isStringArray = (value: unknown): boolean =>
    Array.isArray(value) && value.every((item) => typeof item === "string");

export const requireObjectField = (record: Record<string, unknown>, key: string): string[] =>
    Object.hasOwn(record, key) && !isObject(record[key]) ? [`${key} must be an object`] : [];

export const stringFieldErrors = (value: Record<string, unknown>, keys: string[]): string[] =>
    keys
        .filter((key) => Object.hasOwn(value, key) && typeof value[key] !== "string")
        .map((key) => `${key} must be a string`);

export const stringArrayFieldError = (value: Record<string, unknown>, key: string, message: string): string[] =>
    Object.hasOwn(value, key) && !isStringArray(value[key]) ? [message] : [];

export const booleanFieldError = (value: Record<string, unknown>, key: string, message: string): string[] =>
    Object.hasOwn(value, key) && typeof value[key] !== "boolean" ? [message] : [];

const stringItems = (value: unknown): string[] | null => {
    if (!Array.isArray(value)) {
        return null;
    }
    const strings = value.filter((item): item is string => typeof item === "string");
    return strings.length === value.length ? strings : null;
};

export const validateEcosystems = (value: unknown): string[] => {
    const items = stringItems(value);
    if (items === null) {
        return ["ecosystems must be an array of ecosystem-name strings"];
    }
    const known = new Set(loadInstallRegistry().records.map((record) => record.ecosystem));
    return items
        .filter((ecosystem) => !known.has(ecosystem))
        .map((ecosystem) => `ecosystems: "${ecosystem}" is not a known ecosystem`);
};

export const validateOwners = (owners: unknown): string[] => {
    if (!isObject(owners)) {
        return ["owners must be an object of surface → { language: tool }"];
    }
    return Object.entries(owners).flatMap(([surface, langMap]) => {
        if (!isObject(langMap)) {
            return [`owners.${surface} must be an object of { language: tool }`];
        }
        return Object.entries(langMap)
            .filter(([, tool]) => typeof tool !== "string")
            .map(([lang]) => `owners.${surface}.${lang} must be a tool name (string)`);
    });
};

const blockExclusionErrors = (entry: unknown, index: number): string[] => {
    if (!isObject(entry)) {
        return [`blockExclusions[${String(index)}] must be an object`];
    }
    const errors: string[] = [];
    if (typeof entry["file"] !== "string") {
        errors.push(`blockExclusions[${String(index)}].file must be a string path`);
    }
    if (typeof entry["rule"] !== "string") {
        errors.push(`blockExclusions[${String(index)}].rule must be a string rule id`);
    }
    const { functions } = entry;
    if (!isStringArray(functions) || (Array.isArray(functions) && functions.length === 0)) {
        errors.push(
            `blockExclusions[${String(index)}].functions must name at least one function block (array of strings)`,
        );
    }
    return errors;
};

export const validateBlockExclusions = (value: unknown): string[] => {
    if (value === undefined) {
        return [];
    }
    if (!Array.isArray(value)) {
        return ["blockExclusions must be an array of { file, rule, functions }"];
    }
    return value.flatMap((entry, index) => blockExclusionErrors(entry, index));
};
