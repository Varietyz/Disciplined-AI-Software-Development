import { existsSync, readdirSync, statSync } from "node:fs";
import { FOUNDATION_SUBJECT } from "../resolvers/anchor.resolver.ts";
import { PLATFORM_PATH_PREFIXES } from "./layer.manifest.ts";
import type { PlatformCapability } from "../../types/manifest.types.ts";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

const CAPABILITY_CONTAINER = (PLATFORM_PATH_PREFIXES[0] ?? "").slice(0, -1);

const CAPABILITY_DIR = absolutePath("app.member", CAPABILITY_CONTAINER);

const NOT_A_CAPABILITY = new Set([FOUNDATION_SUBJECT]);

export const platformCapabilities = function platformCapabilities(): readonly PlatformCapability[] {
    if (CAPABILITY_CONTAINER === "" || !existsSync(CAPABILITY_DIR)) {
        return [];
    }
    return readdirSync(CAPABILITY_DIR)
        .filter((name) => !NOT_A_CAPABILITY.has(name) && statSync(join(CAPABILITY_DIR, name)).isDirectory())
        .map((name) => ({ noun: name, platformPath: `${CAPABILITY_CONTAINER}/${name}/` }));
};
