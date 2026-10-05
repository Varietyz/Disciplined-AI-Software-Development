import { type Dirent, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import type { PathExclusion } from "@govlab/quality/config";
import { join } from "node:path";

export const readTextSafe = function readTextSafe(path: string): string | null {
    return existsSync(path) && statSync(path).isFile() ? readFileSync(path, "utf8") : null;
};

export const readJsonSafe = function readJsonSafe(path: string): unknown {
    const text = readTextSafe(path);
    if (text === null) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch (error) {
        if (!(error instanceof SyntaxError)) {
            throw error;
        }
        return null;
    }
};

export const isDirectory = function isDirectory(path: string): boolean {
    return existsSync(path) && statSync(path).isDirectory();
};

export const readDirSafe = function readDirSafe(dir: string): Dirent[] {
    return isDirectory(dir) ? readdirSync(dir, { withFileTypes: true }) : [];
};

export const sortedNames = function sortedNames(dir: string): string[] {
    return readDirSafe(dir)
        .map((entry) => entry.name)
        .toSorted((left, right) => left.localeCompare(right));
};

export const walkFiles = function walkFiles(dir: string, excluded: PathExclusion): string[] {
    return readDirSafe(dir).flatMap((entry): string[] => {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            return excluded(full) ? [] : walkFiles(full, excluded);
        }
        return entry.isFile() ? [full] : [];
    });
};
