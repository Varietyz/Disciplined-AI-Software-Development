import { ROOT, absolutePath } from "@ssot/paths";
import { extname, join, relative } from "node:path";
import { readFileSync, readdirSync } from "node:fs";
import { CONFIG_EXTENSIONS } from "#configuration/constants/nginx.constants";
import type { ConfigFile } from "#types/nginx.types";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";

const filesUnder = function filesUnder(folder: string): string[] {
    return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
        const full = join(folder, entry.name);
        return entry.isDirectory() ? filesUnder(full) : [full];
    });
};

export const serverConfigFiles = function serverConfigFiles(): ConfigFile[] {
    return filesUnder(absolutePath("app.nginx"))
        .filter((file) => CONFIG_EXTENSIONS.has(extname(file)))
        .map((file) => ({ path: normalizePath(relative(ROOT, file)), text: readFileSync(file, "utf8") }));
};
