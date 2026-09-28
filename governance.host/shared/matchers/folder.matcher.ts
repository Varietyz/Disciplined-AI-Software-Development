import {
    isConcernFolder,
    isDeclaredContainer,
    isLegalSubject,
    isMarkerFolder,
    vocabularyFor,
} from "../manifests/taxonomy.manifest.ts";
import { isKebab } from "./filename.matcher.ts";

const holdsRole = function holdsRole(root: string, name: string, role: string): boolean {
    if (role === "container") {
        return isDeclaredContainer(root, name);
    }
    if (role === "subject") {
        return isLegalSubject(name, root);
    }
    if (role === "concern") {
        return isConcernFolder(name, root) || isMarkerFolder(name, root);
    }
    return false;
};

const ranksAtDepth = function ranksAtDepth(root: string, name: string, depth: number, after: number): number[] {
    const { roleOrder, rolesAtDepth } = vocabularyFor(root).roles;
    const ranks: number[] = [];
    for (const role of rolesAtDepth[depth - 1] ?? []) {
        const rank = roleOrder.indexOf(role);
        if (rank > after && holdsRole(root, name, role)) {
            ranks.push(rank);
        }
    }
    return ranks;
};

export const roleAtDepth = function roleAtDepth(root: string, name: string, depth: number, after: number): number {
    return ranksAtDepth(root, name, depth, after)[0] ?? -1;
};

const terminalRankOf = function terminalRankOf(root: string): number {
    const { roleOrder, terminalRole } = vocabularyFor(root).roles;
    return roleOrder.indexOf(terminalRole);
};

const assignRoles = function assignRoles(
    root: string,
    segments: readonly string[],
    index: number,
    after: number,
): number[] | undefined {
    const name = segments[index];
    if (name === undefined) {
        return after === terminalRankOf(root) ? [] : undefined;
    }
    for (const rank of ranksAtDepth(root, name, index + 1, after)) {
        const rest = assignRoles(root, segments, index + 1, rank);
        if (rest !== undefined) {
            return [rank, ...rest];
        }
    }
    return undefined;
};

const deepestRank = function deepestRank(root: string, segments: readonly string[]): { at: number; after: number } {
    let after = -1;
    for (const [index, name] of segments.entries()) {
        const rank = roleAtDepth(root, name, index + 1, after);
        if (rank === -1) {
            return { after, at: index };
        }
        after = rank;
    }
    return { after, at: segments.length };
};

export const folderPathError = function folderPathError(root: string, segments: readonly string[]): string | undefined {
    const vocabulary = vocabularyFor(root);
    const { roleOrder, rolesAtDepth, terminalRole } = vocabulary.roles;
    if (segments.length > vocabulary.maxDepth) {
        return `nests ${segments.length} folders below the governed root; the cap is ${vocabulary.maxDepth}. overflow relieves sideways — the filename variant slot for a collision, a sibling folder for breadth — never downward`;
    }
    for (const name of segments) {
        if (!isKebab(name, root)) {
            return `folder '${name}' is not ${vocabulary.case}-case`;
        }
    }
    if (assignRoles(root, segments, 0, -1) !== undefined) {
        return undefined;
    }
    const { at, after } = deepestRank(root, segments);
    if (at < segments.length) {
        const allowed = (rolesAtDepth[at] ?? []).join(" | ");
        const later = roleOrder.slice(after + 1).join(" | ");
        return `folder '${segments[at] ?? ""}' resolves to no role at depth ${at + 1}. that depth accepts ${allowed}, and the path has already consumed up to '${roleOrder[after] ?? "(root)"}', so only ${later} may follow`;
    }
    return `the file's parent folder resolves to '${roleOrder[after] ?? "(root)"}', not '${terminalRole}'. every governed file sits directly inside its concern folder`;
};
