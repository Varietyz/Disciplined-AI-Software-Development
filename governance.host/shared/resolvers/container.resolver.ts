import { ambiguousContainer, rootScope, undeclaredContainerPath } from "../strings/taxonomy.strings.ts";
import { containersFor, folderFor, governedRoots } from "../manifests/taxonomy.manifest.ts";

const projectRelativeRoots = function projectRelativeRoots(): string[] {
    return governedRoots().map((root) => root.slice(root.indexOf("/") + 1));
};

export const containerPaths = function containerPaths(): string[] {
    const paths: string[] = [];
    for (const root of governedRoots()) {
        const rel = root.slice(root.indexOf("/") + 1);
        for (const container of containersFor(root)) {
            paths.push(`${rel}/${container}/`);
        }
    }
    return paths;
};

export const containerPath = function containerPath(container: string, root?: string): string {
    const roots = root === undefined ? governedRoots() : [root];
    const found: string[] = [];
    for (const each of roots) {
        const rel = each.slice(each.indexOf("/") + 1);
        for (const declared of containersFor(each)) {
            if (declared === container) {
                found.push(`${rel}/${declared}/`);
            }
        }
    }
    if (found.length === 0) {
        throw new Error(undeclaredContainerPath(container, root === undefined ? "" : rootScope(root)));
    }
    if (found.length > 1) {
        throw new Error(ambiguousContainer(container, found));
    }
    return found[0] ?? "";
};

export const concernFolders = function concernFolders(tag: string, dirs: readonly string[]): string[] {
    const folder = folderFor(tag);
    if (folder === undefined) {
        return [];
    }
    const roots = projectRelativeRoots();
    const found: string[] = [];
    for (const dir of dirs) {
        const trimmed = dir.endsWith("/") ? dir.slice(0, -1) : dir;
        if (trimmed.slice(trimmed.lastIndexOf("/") + 1) !== folder) {
            continue;
        }
        if (roots.some((rel) => trimmed.startsWith(`${rel}/`))) {
            found.push(`${trimmed}/`);
        }
    }
    return found;
};
