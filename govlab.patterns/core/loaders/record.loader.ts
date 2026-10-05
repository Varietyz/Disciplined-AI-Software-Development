import { createReadStream, readFileSync, readdirSync, statSync } from "node:fs";
import { DataLoadError } from "#core/classifiers/schema.classifier";
import type { LoadedData } from "#types/record.types";
import { NO_RECORDS } from "#configuration/strings/schema.strings";
import { createInterface } from "node:readline";
import { isRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { scanFloatFields } from "#core/parsers/field.parser";

const DEPTH_JSONL = 1;
const DEPTH_ARRAY = 2;
const DEPTH_OBJECT = 3;
const ARRAY_OPEN = "[";
const LINE_BREAK = "\n";
const SOURCE_SUFFIXES: readonly string[] = [".json", ".jsonl"];

interface JsonDocument {
    ok: boolean;
    value: unknown;
}

const parseJson = function parseJson(text: string): unknown {
    return JSON.parse(text);
};

const extractRecords = function extractRecords(parsed: unknown): unknown[] {
    if (Array.isArray(parsed)) {
        return parsed;
    }
    const found = isRecord(parsed) ? Object.values(parsed).find((candidate) => Array.isArray(candidate)) : undefined;
    if (Array.isArray(found)) {
        return found;
    }
    throw new DataLoadError(NO_RECORDS);
};

const parseJsonl = function parseJsonl(text: string): unknown[] {
    return text
        .split(LINE_BREAK)
        .filter((line) => line.trim().length > 0)
        .map(parseJson);
};

const wholeDocument = function wholeDocument(text: string): JsonDocument {
    try {
        return { ok: true, value: parseJson(text) };
    } catch (error) {
        if (!(error instanceof SyntaxError)) {
            throw error;
        }
        return { ok: false, value: null };
    }
};

const loadFile = function loadFile(path: string): LoadedData {
    const text = readFileSync(path, "utf8");
    if (text.trimStart().startsWith(ARRAY_OPEN)) {
        return { floatFields: scanFloatFields(text, DEPTH_ARRAY), records: extractRecords(parseJson(text)) };
    }
    const document = wholeDocument(text);
    if (document.ok) {
        return { floatFields: scanFloatFields(text, DEPTH_OBJECT), records: extractRecords(document.value) };
    }
    return { floatFields: scanFloatFields(text, DEPTH_JSONL), records: parseJsonl(text) };
};

const isSource = function isSource(name: string): boolean {
    return SOURCE_SUFFIXES.some((suffix) => name.endsWith(suffix));
};

export const discoverSources = function discoverSources(dir: string): string[] {
    return readdirSync(dir)
        .filter(isSource)
        .sort((a, b) => a.localeCompare(b))
        .map((name) => join(dir, name));
};

const mergeSources = function mergeSources(paths: readonly string[]): LoadedData {
    const loaded = paths.map(loadFile);
    return {
        floatFields: new Set(loaded.flatMap((entry) => [...entry.floatFields])),
        records: loaded.flatMap((entry) => entry.records),
    };
};

export const loadRecords = function loadRecords(path: string): LoadedData {
    return statSync(path).isDirectory() ? mergeSources(discoverSources(path)) : loadFile(path);
};

export const streamJsonlFile = async function* streamJsonlFile(path: string): AsyncGenerator {
    const reader = createInterface({ crlfDelay: Number.POSITIVE_INFINITY, input: createReadStream(path, "utf8") });
    for await (const line of reader) {
        const trimmed = line.trim();
        if (trimmed.length > 0) {
            yield parseJson(trimmed);
        }
    }
};
