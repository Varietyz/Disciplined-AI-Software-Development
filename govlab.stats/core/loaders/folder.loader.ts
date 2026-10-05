import { type Dirent, existsSync, readdirSync, statSync } from "node:fs";
import type { PathExclusion } from "@govlab/quality/config";
import { join } from "node:path";

export const readdirSafe = function readdirSafe(dir: string): Dirent[] {
    return existsSync(dir) && statSync(dir).isDirectory() ? readdirSync(dir, { withFileTypes: true }) : [];
};

export const readdirOrNull = function readdirOrNull(dir: string): Dirent[] | null {
    return existsSync(dir) && statSync(dir).isDirectory() ? readdirSync(dir, { withFileTypes: true }) : null;
};

export const walkFiles = function walkFiles(absDir: string, ignore: PathExclusion): string[] {
    return readdirSafe(absDir).flatMap((entry) => {
        const abs = join(absDir, entry.name);
        if (entry.isDirectory()) {
            return ignore(abs) ? [] : walkFiles(abs, ignore);
        }
        return entry.isFile() ? [abs] : [];
    });
};
