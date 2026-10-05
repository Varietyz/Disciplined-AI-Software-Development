import { existsSync, readdirSync } from "node:fs";
import { BUILD_CONFIG_FILES } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

export const buildConfigFiles = function buildConfigFiles(): string[] {
    const root = absolutePath("app.root");
    return readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => BUILD_CONFIG_FILES.map((name) => join(root, entry.name, name)))
        .filter((file) => existsSync(file));
};
