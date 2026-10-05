import { relative, resolve } from "node:path";
import { readdirSync } from "node:fs";
import { toPosix } from "#core/resolvers/asset.resolver";

export const walk = function walk(root: string, dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const target = resolve(dir, entry.name);
        return entry.isDirectory() ? walk(root, target) : [toPosix(relative(root, target))];
    });
};
