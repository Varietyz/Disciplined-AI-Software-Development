import { KEY_SEPARATOR, SEGMENT_SEPARATOR, SELF_KEY } from "#configuration/constants/location.constants";
import { branchWithoutLocation, descendsThroughLeaf, unknownKey } from "#configuration/strings/location.strings";
import { LOCATION_TREE } from "#core/loaders/location.loader";
import { ROOT } from "#core/resolvers/location.root.resolver";
import { isRecord } from "#core/predicates/location.predicate";
import { join } from "node:path";

const selfOf = function selfOf(node: Record<string, unknown>): string {
    const own = node[SELF_KEY];
    return typeof own === "string" ? own : "";
};

const stepInto = function stepInto(node: unknown, part: string, dottedKey: string): unknown {
    if (!isRecord(node) || !(part in node)) {
        throw new Error(unknownKey(dottedKey));
    }
    return node[part];
};

const terminalOf = function terminalOf(next: unknown, part: string, prefix: string[], dottedKey: string): string {
    if (typeof next === "string") {
        return part === SELF_KEY ? prefix.join(SEGMENT_SEPARATOR) : [...prefix, next].join(SEGMENT_SEPARATOR);
    }
    if (isRecord(next) && selfOf(next).length > 0) {
        return [...prefix, selfOf(next)].join(SEGMENT_SEPARATOR);
    }
    throw new TypeError(branchWithoutLocation(dottedKey));
};

const leafOf = function leafOf(dottedKey: string): string {
    const parts = dottedKey.split(KEY_SEPARATOR);
    const prefix: string[] = [];
    let node: unknown = LOCATION_TREE;
    for (const [index, part] of parts.entries()) {
        const next: unknown = stepInto(node, part, dottedKey);
        if (index === parts.length - 1) {
            return terminalOf(next, part, prefix, dottedKey);
        }
        if (!isRecord(next)) {
            throw new TypeError(descendsThroughLeaf(dottedKey));
        }
        const own = selfOf(next);
        if (own.length > 0) {
            prefix.push(own);
        }
        node = next;
    }
    throw new Error(unknownKey(dottedKey));
};

export const absolutePath = function absolutePath(dottedKey: string, ...segments: string[]): string {
    return join(ROOT, ...leafOf(dottedKey).split(SEGMENT_SEPARATOR), ...segments);
};

export const relativePath = function relativePath(dottedKey: string, ...segments: string[]): string {
    return [leafOf(dottedKey), ...segments].join(SEGMENT_SEPARATOR);
};
