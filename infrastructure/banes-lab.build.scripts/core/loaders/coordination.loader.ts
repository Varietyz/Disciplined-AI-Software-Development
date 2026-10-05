import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MANIFEST = "package.json";
const FILES_KEY = "files";

const listedFiles = function listedFiles(parsed: unknown): string[] {
    if (typeof parsed !== "object" || parsed === null || !(FILES_KEY in parsed)) {
        return [];
    }
    const listed: unknown = parsed[FILES_KEY];
    return Array.isArray(listed) ? listed.filter((entry): entry is string => typeof entry === "string") : [];
};

export const shippedEntries = function shippedEntries(member: string): string[] {
    const manifest = join(member, MANIFEST);
    if (!existsSync(manifest)) {
        return [];
    }
    const parsed: unknown = JSON.parse(readFileSync(manifest, "utf8"));
    return [MANIFEST, ...listedFiles(parsed)];
};
