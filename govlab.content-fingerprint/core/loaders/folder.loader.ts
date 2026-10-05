import type { CollectOptions, FolderScan } from "#types/folder.types";
import { type Dirent, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const includeAll = function includeAll(): boolean {
    return true;
};

const excludeNone = function excludeNone(): boolean {
    return false;
};

const readEntries = function readEntries(dir: string): Dirent[] {
    return existsSync(dir) ? readdirSync(dir, { withFileTypes: true }) : [];
};

const scan = function scan(
    dir: string,
    excluded: (dir: string) => boolean,
    include: (name: string) => boolean,
): FolderScan {
    const entries = readEntries(dir);
    const dirs = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(dir, entry.name))
        .filter((child) => !excluded(child));
    const files = entries
        .filter((entry) => !entry.isDirectory() && include(entry.name))
        .map((entry) => join(dir, entry.name));
    return { dirs, files };
};

export const collectFiles = function collectFiles(root: string, options: CollectOptions = {}): string[] {
    const excluded = options.excluded ?? excludeNone;
    const include = options.include ?? includeAll;
    const out: string[] = [];
    const stack: string[] = [root];
    while (stack.length > 0) {
        const { dirs, files } = scan(stack.pop() ?? root, excluded, include);
        out.push(...files);
        stack.push(...dirs);
    }
    return out.sort((a, b) => a.localeCompare(b));
};
