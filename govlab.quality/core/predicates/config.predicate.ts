import type { ConfigValue } from "#types/emitter.types";

export const isConfigObject = function isConfigObject(value: ConfigValue): value is Record<string, ConfigValue> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};
