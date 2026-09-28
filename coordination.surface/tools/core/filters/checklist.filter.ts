import { BLOCKING_SUFFIX, VENUE_ARCHIVE } from "../constants/blocking.constants.ts";
import { contentIsImmutable, slotList, surfacePrefix } from "../../../config/surface.config.ts";
import { PLANNING_ROOTS } from "../constants/checklist.constants.ts";

const byName = function byName(left: string, right: string): number {
    return left.localeCompare(right, "en");
};

const directoryOf = function directoryOf(path: string): string {
    const slash = path.lastIndexOf("/");
    return slash === -1 ? "." : path.slice(0, slash);
};

const isRewritable = function isRewritable(path: string): boolean {
    return !contentIsImmutable(path);
};

const isUpstream = function isUpstream(path: string): boolean {
    const prefix = surfacePrefix();
    const roots = [
        ...slotList("surface", "upstream").map((tail) => (prefix.length === 0 ? tail : `${prefix}/${tail}`)),
        ...slotList("project", "upstream_roots"),
    ];
    return roots.some((root) => path.startsWith(`${root}/`));
};

export const planningSurfaces = function planningSurfaces(paths: readonly string[]): string[] {
    return paths
        .filter((path) => path.endsWith(".md"))
        .filter((path) => PLANNING_ROOTS.includes(directoryOf(path)))
        .toSorted(byName);
};

export const activeVenues = function activeVenues(paths: readonly string[]): string[] {
    return paths
        .filter((path) => path.endsWith(BLOCKING_SUFFIX))
        .filter((path) => !path.startsWith(VENUE_ARCHIVE))
        .toSorted(byName);
};

export const authoredSurfaces = function authoredSurfaces(paths: readonly string[]): string[] {
    return paths
        .filter((path) => path.endsWith(".md"))
        .filter((path) => !isUpstream(path))
        .filter(isRewritable)
        .toSorted(byName);
};
