import type { CatalogRow } from "#types/deployment.types";

const ROOT_LISTS: readonly string[] = ["collections", "documents", "pages", "queries", "trees"];
const JSON_COLUMN = "json";
const MARKDOWN_COLUMN = "markdown";
const BYTES_COLUMN = "bytes";
const FINGERPRINT_COLUMN = "fingerprint";
const REF_COLUMN = "ref";
const TITLE_COLUMN = "title";

const fieldOf = function fieldOf(value: unknown, key: string): unknown {
    return typeof value === "object" && value !== null && key in value ? Reflect.get(value, key) : undefined;
};

const textOf = function textOf(value: unknown): string | null {
    return typeof value === "string" ? value : null;
};

const listOf = function listOf(value: unknown): readonly unknown[] {
    return Array.isArray(value) ? value : [];
};

const rowFrom = function rowFrom(read: (column: string) => unknown): CatalogRow | null {
    const json = textOf(read(JSON_COLUMN));
    const bytes = read(BYTES_COLUMN);
    const fingerprint = textOf(read(FINGERPRINT_COLUMN));
    if (json === null || typeof bytes !== "number" || fingerprint === null) {
        return null;
    }
    return {
        bytes,
        fingerprint,
        json,
        markdown: textOf(read(MARKDOWN_COLUMN)),
        ref: textOf(read(REF_COLUMN)),
        title: textOf(read(TITLE_COLUMN)),
    };
};

export const rootRows = function rootRows(root: unknown): readonly CatalogRow[] {
    return ROOT_LISTS.flatMap((key) => {
        const [first] = listOf(fieldOf(root, key));
        const row = rowFrom((column) => fieldOf(first, column));
        return row === null ? [] : [row];
    });
};

export const shardAddresses = function shardAddresses(head: unknown): readonly string[] {
    return listOf(fieldOf(head, "shards")).flatMap((shard) => {
        const address = textOf(fieldOf(shard, JSON_COLUMN));
        return address === null ? [] : [address];
    });
};

export const shardRow = function shardRow(shard: unknown): CatalogRow | null {
    const columns = listOf(fieldOf(shard, "columns"));
    const [cells] = listOf(fieldOf(shard, "rows"));
    return rowFrom((column) => listOf(cells)[columns.indexOf(column)]);
};
