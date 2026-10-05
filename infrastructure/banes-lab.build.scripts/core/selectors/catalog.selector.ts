import { fileOfAddress, localAddress } from "#core/resolvers/catalog.resolver";
import type { ManifestRow } from "#types/catalog.types";
import { isRecord } from "#core/selectors/base.selector";

export const stringsIn = function stringsIn(value: unknown): string[] {
    if (typeof value === "string") {
        return [value];
    }
    if (Array.isArray(value)) {
        return value.flatMap(stringsIn);
    }
    return isRecord(value) ? Object.values(value).flatMap(stringsIn) : [];
};

export const rowsOf = function rowsOf(raw: string): readonly ManifestRow[] {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed["columns"]) || !Array.isArray(parsed["rows"])) {
        return [];
    }
    const columns: readonly unknown[] = parsed["columns"];
    const at = (name: string): number => columns.indexOf(name);
    return parsed["rows"]
        .filter(Array.isArray)
        .map((row: readonly unknown[]) => ({
            bytes: Number(row[at("bytes")]),
            fingerprint: String(row[at("fingerprint")]),
            json: String(row[at("json")]),
            markdown: typeof row[at("markdown")] === "string" ? String(row[at("markdown")]) : null,
            ref: String(row[at("ref")]),
        }));
};

export const columnValues = function columnValues(raw: string, column: string): readonly unknown[] {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed["columns"]) || !Array.isArray(parsed["rows"])) {
        return [];
    }
    const at = parsed["columns"].indexOf(column);
    return at === -1 ? [] : parsed["rows"].filter(Array.isArray).map((row: readonly unknown[]) => row[at]);
};

export const shardFilesOf = function shardFilesOf(raw: string, site: string): readonly string[] {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !Array.isArray(parsed["shards"])) {
        return [];
    }
    return parsed["shards"].flatMap((shard: unknown) =>
        isRecord(shard) && typeof shard["json"] === "string" ? [fileOfAddress(localAddress(site, shard["json"]))] : [],
    );
};
