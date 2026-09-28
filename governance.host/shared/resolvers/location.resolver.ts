import { PROJECT_ROOT, normalizePath } from "./anchor.resolver.ts";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { jsonRecordAt } from "../loaders/manifest.loader.ts";

const MEMBER_MANIFEST = "_manifest.json";
const SELF_GOVERNED_KEY = "selfGoverned";
const PATHS_FIELD = "paths";

const declaredPaths = function declaredPaths(parsed: unknown): string | null {
    if (typeof parsed !== "object" || parsed === null || !(SELF_GOVERNED_KEY in parsed)) {
        return null;
    }
    const declared: unknown = parsed[SELF_GOVERNED_KEY];
    if (typeof declared !== "object" || declared === null || !(PATHS_FIELD in declared)) {
        return null;
    }
    const paths: unknown = declared[PATHS_FIELD];
    return typeof paths === "string" ? paths : null;
};

const memberPathsConfig = function memberPathsConfig(member: string): string[] {
    const manifest = join(PROJECT_ROOT, member, MEMBER_MANIFEST);
    if (!existsSync(manifest)) {
        return [];
    }
    const declared = declaredPaths(jsonRecordAt(manifest));
    return declared === null ? [] : [normalizePath(join(PROJECT_ROOT, member, declared))];
};

export const MEMBER_PATHS_CONFIGS: ReadonlySet<string> = new Set(
    existsSync(PROJECT_ROOT) ? readdirSync(PROJECT_ROOT).flatMap(memberPathsConfig) : [],
);
