import { ICONS_CONCERN, ICONS_SUFFIX, ICON_PREFIX } from "#configuration/constants/icons.constants";
import { absolutePath, relativePath } from "@ssot/paths";
import { concernFolders } from "@ssot/govlab/shared/resolvers/container.resolver.ts";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { projectDirs } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { readdirSync } from "node:fs";

const MEMBER = relativePath("app.member");
const MEMBER_BELOW_ROOT = `${MEMBER.slice(MEMBER.indexOf("/") + 1)}/`;

const iconFiles = function iconFiles(): string[] {
    return concernFolders(ICONS_CONCERN, projectDirs())
        .filter((folder) => folder.startsWith(MEMBER_BELOW_ROOT))
        .map((folder) => absolutePath("app.root", folder))
        .flatMap((folder) =>
            readdirSync(folder)
                .filter((name) => name.endsWith(ICONS_SUFFIX))
                .sort((a, b) => a.localeCompare(b))
                .map((name) => join(folder, name)),
        );
};

const loadModule = async function loadModule(file: string): Promise<unknown> {
    const loaded: unknown = await import(pathToFileURL(file).href);
    return loaded;
};

const iconNamesOf = function iconNamesOf(module: unknown): string[] {
    if (typeof module !== "object" || module === null) {
        return [];
    }
    return Object.values(module)
        .filter((value): value is string => typeof value === "string" && value.startsWith(ICON_PREFIX))
        .map((value) => value.slice(ICON_PREFIX.length));
};

export const discoverIcons = async function discoverIcons(): Promise<readonly string[]> {
    const loaded = await Promise.all(iconFiles().map(loadModule));
    return [...new Set(loaded.flatMap(iconNamesOf))].sort((a, b) => a.localeCompare(b));
};
