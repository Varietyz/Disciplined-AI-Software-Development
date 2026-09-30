import { PROJECT_ROOT, normalizePath } from "./anchor.resolver.ts";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { jsonRecordAt } from "../loaders/manifest.loader.ts";

const MEMBER_MANIFEST = "_manifest.json";
const SELF_GOVERNED_KEY = "selfGoverned";
const PATHS_FIELD = "paths";
const WRITES_FIELD = "writes";

const declaredField = function declaredField(parsed: unknown, field: string): string | null {
    if (typeof parsed !== "object" || parsed === null || !(SELF_GOVERNED_KEY in parsed)) {
        return null;
    }
    const declared: unknown = parsed[SELF_GOVERNED_KEY];
    if (typeof declared !== "object" || declared === null) {
        return null;
    }
    const value: unknown = Object.entries(declared).find(([key]) => key === field)?.[1];
    return typeof value === "string" ? value : null;
};

const memberDeclaration = function memberDeclaration(member: string, field: string): string | null {
    const manifest = join(PROJECT_ROOT, member, MEMBER_MANIFEST);
    if (!existsSync(manifest)) {
        return null;
    }
    const declared = declaredField(jsonRecordAt(manifest), field);
    return declared === null ? null : normalizePath(join(PROJECT_ROOT, member, declared));
};

const MEMBERS: readonly string[] = existsSync(PROJECT_ROOT) ? readdirSync(PROJECT_ROOT) : [];

export const MEMBER_PATHS_CONFIGS: ReadonlySet<string> = new Set(
    MEMBERS.flatMap((member) => {
        const declared = memberDeclaration(member, PATHS_FIELD);
        return declared === null ? [] : [declared];
    }),
);

export const WRITE_GOVERNED_MEMBERS: readonly string[] = MEMBERS.flatMap((member) => {
    const gate = memberDeclaration(member, WRITES_FIELD);
    return gate !== null && existsSync(gate) ? [normalizePath(join(PROJECT_ROOT, member))] : [];
});

export const governsOwnWrites = function governsOwnWrites(filename: string): boolean {
    const posix = normalizePath(filename);
    return WRITE_GOVERNED_MEMBERS.some((member) => posix.startsWith(`${member}/`));
};
