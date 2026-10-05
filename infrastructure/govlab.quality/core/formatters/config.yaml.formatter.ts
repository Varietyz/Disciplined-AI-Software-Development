import type { ConfigValue } from "#types/emitter.types";
import { defineFormatter } from "#core/registries/formatter.registry";
import { everyChar } from "@govlab/constants";
import { isConfigObject } from "#core/predicates/config.predicate";
import { treeFor } from "#core/converters/emitter.converter";

const YAML_INDENT = 2;
const YAML_RESERVED = new Set(["true", "false", "null", "yes", "no", "on", "off", "~", ""]);
const YAML_INDICATORS = new Set([
    "-",
    "?",
    ":",
    ",",
    "[",
    "]",
    "{",
    "}",
    "#",
    "&",
    "*",
    "!",
    "|",
    ">",
    "'",
    '"',
    "%",
    "@",
    "`",
    " ",
]);
const QUOTE_TRIGGERS = new Set([":", "#", "\n", "\t"]);

const carriesTrigger = function carriesTrigger(value: string): boolean {
    return !everyChar(value, (ch) => !QUOTE_TRIGGERS.has(ch));
};

const needsQuote = function needsQuote(value: string): boolean {
    if (YAML_RESERVED.has(value.toLowerCase())) {
        return true;
    }
    if (value.length > 0 && YAML_INDICATORS.has(value[0] ?? "")) {
        return true;
    }
    return carriesTrigger(value) || (value !== "" && Number.isFinite(Number(value)));
};

const scalar = function scalar(value: boolean | number | string | null): string {
    if (value === null) {
        return "null";
    }
    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }
    if (typeof value === "number") {
        return String(value);
    }
    return needsQuote(value) ? JSON.stringify(value) : value;
};

const isScalar = function isScalar(value: ConfigValue): value is boolean | number | string | null {
    return !isConfigObject(value) && !Array.isArray(value);
};

const inline = function inline(value: ConfigValue): string {
    if (Array.isArray(value)) {
        return "[]";
    }
    return isConfigObject(value) ? "{}" : scalar(value);
};

const emitArray = function emitArray(items: ConfigValue[], indent: number): string[] {
    const pad = " ".repeat(indent);
    return items.map((item) => {
        if (isConfigObject(item) && Object.keys(item).length > 0) {
            const flow = Object.entries(item)
                .map(([key, child]) => `${key}: ${inline(child)}`)
                .join(", ");
            return `${pad}- { ${flow} }`;
        }
        return `${pad}- ${inline(item)}`;
    });
};

const emitMap = function emitMap(obj: Record<string, ConfigValue>, indent: number): string[] {
    const pad = " ".repeat(indent);
    return Object.entries(obj).flatMap(([key, child]): string[] => {
        if (isConfigObject(child) && Object.keys(child).length > 0) {
            return [`${pad}${key}:`, ...emitMap(child, indent + YAML_INDENT)];
        }
        if (Array.isArray(child) && child.length > 0) {
            return [`${pad}${key}:`, ...emitArray(child, indent + YAML_INDENT)];
        }
        return [`${pad}${key}: ${inline(child)}`];
    });
};

const rootLines = function rootLines(tree: ConfigValue): string[] {
    if (isConfigObject(tree)) {
        return emitMap(tree, 0);
    }
    if (Array.isArray(tree)) {
        return emitArray(tree, 0);
    }
    return isScalar(tree) ? [scalar(tree)] : [];
};

export const serializeYaml = function serializeYaml(tree: ConfigValue): string {
    return `${rootLines(tree).join("\n")}\n`;
};

defineFormatter({ format: "yaml", render: (input) => serializeYaml(treeFor(input)) });
