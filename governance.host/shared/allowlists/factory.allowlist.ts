import type { OptionsCarrier } from "../../types/manifest.types.ts";

export const RAW_ELEMENT_FACTORIES: ReadonlySet<string> = new Set<string>();

export const ELEMENT_FACTORY_MODULES: ReadonlySet<string> = new Set<string>();

export const FACTORY_OPTIONS_SCHEMA = [
    {
        additionalProperties: false,
        properties: { factories: { items: { type: "string" }, type: "array" } },
        type: "object",
    },
];

export const MODULE_OPTIONS_SCHEMA = [
    {
        additionalProperties: false,
        properties: { modules: { items: { type: "string" }, type: "array" } },
        type: "object",
    },
];

export const WRITER_OPTIONS_SCHEMA = [
    {
        additionalProperties: false,
        properties: {
            modules: { items: { type: "string" }, type: "array" },
            writers: { items: { type: "string" }, type: "array" },
        },
        type: "object",
    },
];

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const declaredNames = function declaredNames(context: OptionsCarrier, key: string): string[] {
    const options: unknown = context.options.at(0);
    if (!isRecord(options)) {
        return [];
    }
    const value = options[key];
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
};

export const declaredFactories = function declaredFactories(
    context: OptionsCarrier,
    fallback: ReadonlySet<string>,
): ReadonlySet<string> {
    const declared = declaredNames(context, "factories");
    return declared.length > 0 ? new Set(declared) : fallback;
};

export const declaredModules = function declaredModules(
    context: OptionsCarrier,
    fallback: ReadonlySet<string>,
): ReadonlySet<string> {
    const declared = declaredNames(context, "modules");
    return declared.length > 0 ? new Set(declared) : fallback;
};

export const declaredWriters = function declaredWriters(
    context: OptionsCarrier,
    fallback: ReadonlySet<string>,
): ReadonlySet<string> {
    const declared = declaredNames(context, "writers");
    return declared.length > 0 ? new Set(declared) : fallback;
};
