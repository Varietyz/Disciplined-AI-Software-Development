import { existsSync, readFileSync } from "node:fs";
import { MODULE_MANIFEST_NAME } from "#configuration/constants/loader.constants";
import { isRecord } from "#core/selectors/base.selector";
import { join } from "node:path";

const SELF_GOVERNED_KEY = "selfGoverned";
const GOVERNED_PATH_KEY = "paths";

const parsedAt = function parsedAt(file: string): unknown {
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
};

export const principlesOf = function principlesOf(folder: string, source: string): readonly string[] {
    const parsed = source.length === 0 ? null : parsedAt(join(folder, source));
    const governance = isRecord(parsed) ? parsed["governance"] : null;
    const principles = isRecord(governance) ? governance["principles"] : null;
    return Array.isArray(principles) ? principles.filter((id): id is string => typeof id === "string") : [];
};

export const selfGovernedPathOf = function selfGovernedPathOf(root: string): string | null {
    const parsed = parsedAt(join(root, MODULE_MANIFEST_NAME));
    const governed = isRecord(parsed) ? parsed[SELF_GOVERNED_KEY] : null;
    const path = isRecord(governed) ? governed[GOVERNED_PATH_KEY] : null;
    return typeof path === "string" ? path : null;
};
