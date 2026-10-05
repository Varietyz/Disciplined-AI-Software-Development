import { type Dirent, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const MODULES_FOLDER = "node_modules";
const LOCKFILE = "package-lock.json";
const HISTORY_FOLDER = ".git";
const SKIPPED: ReadonlySet<string> = new Set([HISTORY_FOLDER]);

const isBreach = function isBreach(entry: Dirent): boolean {
    return (entry.isDirectory() && entry.name === MODULES_FOLDER) || (entry.isFile() && entry.name === LOCKFILE);
};

const descends = function descends(entry: Dirent): boolean {
    return entry.isDirectory() && entry.name !== MODULES_FOLDER && !SKIPPED.has(entry.name);
};

export const hoistBreaches = function hoistBreaches(root: string): readonly string[] {
    const found: string[] = [];
    const walk = function walk(directory: string): void {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (directory !== root && isBreach(entry)) {
                found.push(path);
            }
            if (descends(entry)) {
                walk(path);
            }
        }
    };
    walk(root);
    return found.map((path) => relative(root, path).split(sep).join("/")).toSorted((a, b) => a.localeCompare(b));
};
