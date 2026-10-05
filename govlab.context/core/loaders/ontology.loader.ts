import {
    CATEGORIES_SOURCE,
    CATEGORY_KEY,
    CHECK_KEY,
    JSON_EXTENSION,
    RECORDS_KEY,
} from "#configuration/constants/ontology.constants";
import type { JsonDirOptions, Normalizer } from "#types/ontology.types";
import { readFileSync, readdirSync } from "node:fs";
import type { ReadAudit } from "#core/observers/record.observer";
import { asCheck } from "#core/converters/check.converter";
import { join } from "node:path";

export const readJsonFile = function readJsonFile(file: string): unknown {
    return JSON.parse(readFileSync(file, "utf8"));
};

export const readJsonDir = function readJsonDir(dir: string, options: JsonDirOptions = {}): unknown[] {
    return readdirSync(dir)
        .filter((name) => name.endsWith(JSON_EXTENSION))
        .filter((name) => (options.only ? options.only(name) : true))
        .filter((name) => (options.exclude ? !options.exclude(name) : true))
        .toSorted((a, b) => a.localeCompare(b))
        .map((name) => readJsonFile(join(dir, name)));
};

const foldGroup = function foldGroup<R>(
    group: Record<string, unknown>,
    normalize: Normalizer<R>,
    audit: ReadAudit,
): R[] {
    const category = typeof group[CATEGORY_KEY] === "string" ? group[CATEGORY_KEY] : "";
    const declared = asCheck(group[CHECK_KEY]);
    audit.attribution(group);
    return audit.records(group[RECORDS_KEY], category).map((record) => normalize(record, category, declared, group));
};

export const foldCategories = function foldCategories<R>(
    categories: unknown[],
    normalize: Normalizer<R>,
    audit: ReadAudit,
): R[] {
    return audit.records(categories, CATEGORIES_SOURCE).flatMap((group) => foldGroup(group, normalize, audit));
};

export const loadCategories = function loadCategories<R>(
    dir: string,
    normalize: Normalizer<R>,
    audit: ReadAudit,
    options: JsonDirOptions = {},
): R[] {
    return foldCategories(readJsonDir(dir, options), normalize, audit);
};
