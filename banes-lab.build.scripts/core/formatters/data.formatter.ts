import { addressLines, blocks, code, heading, quote, section } from "#core/formatters/markdown.formatter";
import type { Identity } from "#types/catalog.types";
import { isObjectValue } from "#core/converters/schema.converter";

const TABLE_KEYS: ReadonlySet<string> = new Set(["columns", "rows"]);
const NAMING_KEYS: ReadonlySet<string> = new Set(["ref", "title"]);
const CELL_SEPARATOR = " | ";
const ROW_OPEN = "| ";
const ROW_CLOSE = " |";
const RULE_CELL = "---";
const PIPE = "|";
const ESCAPED_PIPE = String.raw`\|`;
const LINE_END = "\n";
const SPACE = " ";
const LIST_SEPARATOR = ", ";
const ENTRY_JOINER = ": ";

const valueText = function valueText(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || value === undefined) {
        return String(value);
    }
    return JSON.stringify(value);
};

const cellText = function cellText(value: unknown): string {
    const text = value === null || value === undefined ? "" : valueText(value);
    return text.split(PIPE).join(ESCAPED_PIPE).split(LINE_END).join(SPACE);
};

const itemText = function itemText(value: unknown): string {
    if (isObjectValue(value) && typeof value["label"] === "string") {
        const target = value["markdown"] ?? value["json"] ?? value["href"];
        return typeof target === "string" ? `[${value["label"]}](${target})` : value["label"];
    }
    if (Array.isArray(value)) {
        return value.map(itemText).join(LIST_SEPARATOR);
    }
    return valueText(value);
};

const tableOf = function tableOf(data: Record<string, unknown>): string | null {
    const { columns, rows } = data;
    if (!Array.isArray(columns) || !Array.isArray(rows) || rows.length === 0) {
        return null;
    }
    const line = (cells: readonly unknown[]): string => ROW_OPEN + cells.map(cellText).join(CELL_SEPARATOR) + ROW_CLOSE;
    return [
        line(columns),
        line(columns.map(() => RULE_CELL)),
        ...rows.map((row) => line(Array.isArray(row) ? row : [row])),
    ].join(LINE_END);
};

const fieldBlock = function fieldBlock(key: string, value: unknown): string | null {
    if (Array.isArray(value)) {
        return section(key, value.map(itemText));
    }
    if (isObjectValue(value)) {
        return section(
            key,
            Object.entries(value).map(([name, held]) => code(name) + ENTRY_JOINER + itemText(held)),
        );
    }
    return null;
};

export const renderDataLeaf = function renderDataLeaf(identity: Identity, data: object, site: string): string {
    const fields = Object.entries(data).filter(([key]) => !TABLE_KEYS.has(key) && !NAMING_KEYS.has(key));
    const scalars = fields.filter(([, value]) => !Array.isArray(value) && !isObjectValue(value));
    const record = isObjectValue(data) ? data : {};
    return blocks([
        heading(identity.title),
        quote(identity.summary),
        addressLines([
            ["This leaf as JSON", site + identity.address.json],
            ...scalars.map(([key, value]): readonly [string, string | null] => [
                key,
                value === null ? null : itemText(value),
            ]),
        ]),
        ...fields.map(([key, value]) => fieldBlock(key, value)),
        tableOf(record),
    ]);
};
