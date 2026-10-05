import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { PAGE_EXTENSION } from "#configuration/constants/asset.constants";
import { absolutePath } from "@ssot/paths";
import { toPosix } from "#core/resolvers/asset.resolver";

const SLASH = "/";

export const buildOutput = function buildOutput(): string {
    return absolutePath("builds.web");
};

export const readOrNull = function readOrNull(file: string): string | null {
    const target = join(buildOutput(), file);
    return existsSync(target) ? readFileSync(target, "utf8") : null;
};

export const sourcePagePaths = function sourcePagePaths(page: string): readonly string[] {
    const root = join(buildOutput(), page);
    if (!existsSync(root)) {
        return [];
    }
    return readdirSync(root, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(PAGE_EXTENSION) && entry.parentPath !== root)
        .map((entry) => {
            const file = toPosix(relative(buildOutput(), join(entry.parentPath, entry.name)));
            return SLASH + file.slice(0, -PAGE_EXTENSION.length);
        })
        .toSorted((left, right) => left.localeCompare(right));
};

export const pageIds = async function pageIds(): Promise<readonly string[]> {
    const ids = await import("@banes-lab/web/core/ids/page.ids.ts");
    return Object.values(ids);
};
