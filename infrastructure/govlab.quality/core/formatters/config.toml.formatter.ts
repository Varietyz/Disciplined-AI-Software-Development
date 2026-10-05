import type { ConfigValue } from "#types/emitter.types";
import { defineFormatter } from "#core/registries/formatter.registry";
import { isConfigObject } from "#core/predicates/config.predicate";
import { treeFor } from "#core/converters/emitter.converter";

const scalar = function scalar(value: boolean | number | string | null): string {
    if (value === null) {
        return '""';
    }
    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }
    return typeof value === "number" ? String(value) : JSON.stringify(value);
};

const tomlValue = function tomlValue(value: ConfigValue): string {
    if (Array.isArray(value)) {
        const items = value.filter(
            (item): item is boolean | number | string | null => !isConfigObject(item) && !Array.isArray(item),
        );
        return `[${items.map(scalar).join(", ")}]`;
    }
    return isConfigObject(value) ? "{}" : scalar(value);
};

const partitionTable = function partitionTable(obj: Record<string, ConfigValue>): {
    scalars: string[];
    tables: [string, Record<string, ConfigValue>][];
} {
    const scalars: string[] = [];
    const tables: [string, Record<string, ConfigValue>][] = [];
    for (const [key, value] of Object.entries(obj)) {
        if (isConfigObject(value)) {
            tables.push([key, value]);
        } else {
            scalars.push(`${key} = ${tomlValue(value)}`);
        }
    }
    return { scalars, tables };
};

const emitTable = function emitTable(name: string | null, obj: Record<string, ConfigValue>): string[] {
    const { scalars, tables } = partitionTable(obj);
    const header = name === null ? [] : [`[${name}]`];
    const spacer = scalars.length > 0 || name !== null ? [""] : [];
    const childLines = tables.flatMap(([key, sub]) => emitTable(name === null ? key : `${name}.${key}`, sub));
    return [...header, ...scalars, ...spacer, ...childLines];
};

const trimTrailingBlank = function trimTrailingBlank(lines: string[]): string[] {
    let end = lines.length;
    while (end > 0 && lines[end - 1] === "") {
        end -= 1;
    }
    return lines.slice(0, end);
};

export const serializeToml = function serializeToml(tree: ConfigValue): string {
    const out = isConfigObject(tree) ? emitTable(null, tree) : [];
    return `${trimTrailingBlank(out).join("\n")}\n`;
};

defineFormatter({ format: "toml", render: (input) => serializeToml(treeFor(input)) });
