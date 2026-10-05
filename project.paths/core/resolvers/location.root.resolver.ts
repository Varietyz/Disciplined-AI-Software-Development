import { MANIFEST_NAME, WORKSPACE_NAME } from "#configuration/constants/location.constants";
import { dirname, join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { isRecord } from "#core/predicates/location.predicate";
import { rootNotFound } from "#configuration/strings/location.strings";

const isWorkspaceRoot = function isWorkspaceRoot(dir: string): boolean {
    const manifest = join(dir, MANIFEST_NAME);
    if (!existsSync(manifest)) {
        return false;
    }
    const parsed: unknown = JSON.parse(readFileSync(manifest, "utf8"));
    return isRecord(parsed) && parsed["name"] === WORKSPACE_NAME && Boolean(parsed["workspaces"]);
};

const deriveRoot = function deriveRoot(): string {
    let dir = import.meta.dirname;
    while (!isWorkspaceRoot(dir)) {
        const parent = dirname(dir);
        if (parent === dir) {
            throw new Error(rootNotFound(WORKSPACE_NAME));
        }
        dir = parent;
    }
    return dir;
};

export const ROOT = deriveRoot();
