import type { ConfigValue } from "#types/emitter.types";
import { defineFormatter } from "#core/registries/formatter.registry";
import { isConfigObject } from "#core/predicates/config.predicate";
import { treeFor } from "#core/converters/emitter.converter";

const scalar = function scalar(value: boolean | number | string | null): string {
    if (value === null) {
        return "";
    }
    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }
    return String(value);
};

const iniValue = function iniValue(value: ConfigValue): string {
    if (Array.isArray(value)) {
        return value
            .filter((item): item is boolean | number | string | null => !isConfigObject(item) && !Array.isArray(item))
            .map(scalar)
            .join(",");
    }
    return isConfigObject(value) ? "" : scalar(value);
};

const emitSection = function emitSection(obj: Record<string, ConfigValue>): string[] {
    return Object.entries(obj)
        .filter(([, value]) => !isConfigObject(value))
        .map(([key, value]) => `${key}=${iniValue(value)}`);
};

const sectionBlock = function sectionBlock(
    key: string,
    value: Record<string, ConfigValue>,
    needsSeparator: boolean,
): string[] {
    return [...(needsSeparator ? [""] : []), `[${key}]`, ...emitSection(value)];
};

export const serializeIni = function serializeIni(tree: ConfigValue): string {
    if (!isConfigObject(tree)) {
        return "\n";
    }
    const lines = emitSection(tree);
    for (const [key, value] of Object.entries(tree)) {
        if (isConfigObject(value)) {
            lines.push(...sectionBlock(key, value, lines.length > 0));
        }
    }
    return `${lines.join("\n")}\n`;
};

defineFormatter({ format: "ini", render: (input) => serializeIni(treeFor(input)) });
