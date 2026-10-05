import fs from "node:fs";
import { isNotFound } from "#core/predicates/failure.predicate";
import path from "node:path";

const missingOr = function missingOr<T>(error: unknown, fallback: T): T {
    if (error instanceof Error && isNotFound(error)) {
        return fallback;
    }
    throw error;
};

export const readFileSafe = function readFileSafe(file: string): string {
    try {
        return fs.readFileSync(file, "utf8");
    } catch (error) {
        return missingOr(error, "");
    }
};

export const safeReaddir = function safeReaddir(dir: string): fs.Dirent[] {
    try {
        return fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
        return missingOr<fs.Dirent[]>(error, []);
    }
};

export const safeStat = function safeStat(target: string): fs.Stats | null {
    try {
        return fs.statSync(target);
    } catch (error) {
        return missingOr(error, null);
    }
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

export const readJsonFile = function readJsonFile(file: string): unknown {
    const text = readFileSafe(file);
    return text === "" ? undefined : JSON.parse(text);
};

export const readJsonField = function readJsonField(file: string, key: string): unknown {
    const parsed = readJsonFile(file);
    return isRecord(parsed) ? parsed[key] : undefined;
};

export const walkFiles = function walkFiles(dir: string, excluded: (full: string) => boolean): string[] {
    return safeReaddir(dir).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        const stat = safeStat(full);
        if (stat === null) {
            return [];
        }
        if (excluded(full)) {
            return [];
        }
        return stat.isDirectory() ? walkFiles(full, excluded) : [full];
    });
};
