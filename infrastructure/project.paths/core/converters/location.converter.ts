import { SEGMENT_SEPARATOR, SELF_KEY } from "#configuration/constants/location.constants";
import { isPathTree, isRecord } from "#core/predicates/location.predicate";
import { INVALID_ABSOLUTE_TREE } from "#configuration/strings/location.strings";
import { LOCATION_TREE } from "#core/loaders/location.loader";
import type { PathTree } from "#types/location.types";
import { ROOT } from "#core/resolvers/location.root.resolver";
import { join } from "node:path";

const absolutize = function absolutize(node: unknown, prefix: readonly string[]): unknown {
    if (typeof node === "string") {
        return join(ROOT, ...prefix, ...node.split(SEGMENT_SEPARATOR));
    }
    if (!isRecord(node)) {
        return node;
    }
    const own = typeof node[SELF_KEY] === "string" ? node[SELF_KEY] : "";
    const childPrefix = own.length > 0 ? [...prefix, ...own.split(SEGMENT_SEPARATOR)] : [...prefix];
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
        out[key] = key === SELF_KEY ? join(ROOT, ...childPrefix) : absolutize(value, childPrefix);
    }
    return Object.freeze(out);
};

const buildPaths = function buildPaths(): Readonly<PathTree> {
    const built = absolutize(LOCATION_TREE, []);
    if (!isPathTree(built)) {
        throw new Error(INVALID_ABSOLUTE_TREE);
    }
    return built;
};

export const paths: Readonly<PathTree> = buildPaths();
