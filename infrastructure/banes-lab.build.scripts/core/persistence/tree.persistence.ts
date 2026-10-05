import { join, relative } from "node:path";
import type { AnatomyTreeDeclaration } from "@banes-lab/web/types/anatomy.types.js";
import type { FolderSync } from "#types/folder.types";
import { absolutePath } from "@ssot/paths";
import { existsSync } from "node:fs";
import { renderTreeDeclarations } from "#core/formatters/tree.formatter";
import { syncFolder } from "#core/persistence/folder.persistence";
import { toPosix } from "#core/resolvers/asset.resolver";
import { unpublishedFiles } from "#configuration/strings/anatomy.strings";
import { writeCanonicalText } from "@govlab/canonical-write";

const FOLDER_SEPARATOR = "/";

export const persistTreeDeclarations = async function persistTreeDeclarations(
    declarations: readonly AnatomyTreeDeclaration[],
): Promise<void> {
    await writeCanonicalText(absolutePath("app.anatomyTrees"), renderTreeDeclarations(declarations));
};

const foldersOf = function foldersOf(paths: readonly string[]): ReadonlySet<string> {
    const folders = new Set<string>();
    for (const path of paths) {
        let end = path.lastIndexOf(FOLDER_SEPARATOR);
        while (end > 0) {
            folders.add(path.slice(0, end));
            end = path.lastIndexOf(FOLDER_SEPARATOR, end - 1);
        }
    }
    return folders;
};

export const publishTree = async function publishTree(
    from: string,
    to: string,
    paths: readonly string[],
): Promise<FolderSync> {
    const files = new Set(paths);
    const folders = foldersOf(paths);
    const sync = await syncFolder(from, to, (source) => {
        const path = toPosix(relative(from, source));
        return files.has(path) || folders.has(path);
    });
    const missing = paths.filter((path) => !existsSync(join(to, path)));
    if (missing.length > 0) {
        throw new Error(unpublishedFiles(to, missing));
    }
    return sync;
};
