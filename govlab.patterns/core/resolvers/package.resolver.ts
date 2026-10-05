import { basename, join, relative, sep } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { isRecord } from "#core/predicates/record.predicate";

const MEMBER_MANIFEST = "_manifest.json";
const SELF_GOVERNED_KEY = "selfGoverned";
const PATH_SEP = "/";

export const isSelfGoverned = function isSelfGoverned(moduleDir: string): boolean {
    const manifest = join(moduleDir, MEMBER_MANIFEST);
    if (!existsSync(manifest)) {
        return false;
    }
    const parsed: unknown = JSON.parse(readFileSync(manifest, "utf8"));
    return isRecord(parsed) && SELF_GOVERNED_KEY in parsed;
};

export const titleFor = function titleFor(root: string, moduleDir: string): string {
    if (isSelfGoverned(moduleDir)) {
        return basename(moduleDir);
    }
    const rel = relative(root, moduleDir);
    return rel.length > 0 ? rel.split(sep).join(PATH_SEP) : basename(moduleDir);
};
