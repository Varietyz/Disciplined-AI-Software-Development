import { DECLARATION_EXTENSION, SOURCE_EXTENSION } from "#configuration/constants/closure.constants";
import { extname, join, relative } from "node:path";
import { readdirSync, statSync } from "node:fs";
import { MASTER_EXCLUDE_MARKERS } from "@ssot/govlab/shared/generated/exclusions.generated.ts";
import { isExcludedPath } from "@govlab/quality/core/matchers/exclusions.matcher.ts";

export const sourceFilesUnder = function sourceFilesUnder(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
            return sourceFilesUnder(path);
        }
        return path.endsWith(SOURCE_EXTENSION) && !path.endsWith(DECLARATION_EXTENSION) ? [path] : [];
    });
};

export const includedFilesUnder = function includedFilesUnder(
    root: string,
    extensions: ReadonlySet<string>,
    dir: string = root,
): string[] {
    return readdirSync(dir, { withFileTypes: true })
        .filter((entry) => !isExcludedPath(relative(root, join(dir, entry.name)), MASTER_EXCLUDE_MARKERS))
        .flatMap((entry) => {
            const path = join(dir, entry.name);
            if (entry.isDirectory()) {
                return includedFilesUnder(root, extensions, path);
            }
            return entry.isFile() && extensions.has(extname(entry.name)) ? [path] : [];
        });
};
