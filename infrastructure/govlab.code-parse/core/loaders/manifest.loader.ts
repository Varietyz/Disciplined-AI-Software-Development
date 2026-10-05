import {
    FILE_TYPES_KEY,
    GRAMMARS_KEY,
    GRAMMAR_CONFIG_FILE,
    NAME_KEY,
    PACKAGE_GRAMMAR_KEY,
    PACKAGE_MANIFEST_FILE,
} from "#configuration/constants/grammar.constants";
import type { FileTypeEntry, GrammarMeta, GrammarSource } from "#types/grammar.types";
import { existsSync, readFileSync } from "node:fs";
import { isRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";

const asStringArray = function asStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
};

const readJson = function readJson(file: string): unknown {
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
};

const configEntries = function configEntries(packageRoot: string): FileTypeEntry[] {
    const parsed = readJson(join(packageRoot, GRAMMAR_CONFIG_FILE));
    const grammars = isRecord(parsed) && Array.isArray(parsed[GRAMMARS_KEY]) ? parsed[GRAMMARS_KEY] : [];
    return grammars
        .filter(isRecord)
        .map((grammar) => ({
            fileTypes: asStringArray(grammar[FILE_TYPES_KEY]),
            name: typeof grammar[NAME_KEY] === "string" ? grammar[NAME_KEY] : "",
        }))
        .filter((entry) => entry.name.length > 0);
};

const packageFileTypes = function packageFileTypes(packageRoot: string): string[] {
    const parsed = readJson(join(packageRoot, PACKAGE_MANIFEST_FILE));
    const meta = isRecord(parsed) ? parsed[PACKAGE_GRAMMAR_KEY] : null;
    const list: unknown[] = Array.isArray(meta) ? meta : [];
    return list.filter(isRecord).flatMap((entry) => asStringArray(entry[FILE_TYPES_KEY]));
};

export const readGrammarMeta = function readGrammarMeta(packageRoot: string): GrammarMeta {
    const entries = configEntries(packageRoot);
    const pool = [...new Set([...entries.flatMap((entry) => entry.fileTypes), ...packageFileTypes(packageRoot)])];
    return { entries, pool };
};

export const fileTypesForSource = function fileTypesForSource(source: GrammarSource, meta: GrammarMeta): string[] {
    const matched = meta.entries.find((entry) => entry.name === source.lang);
    return matched && matched.fileTypes.length > 0 ? matched.fileTypes : meta.pool;
};
