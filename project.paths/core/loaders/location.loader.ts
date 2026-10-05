import { INVALID_TREE } from "#configuration/strings/location.strings";
import type { PathTree } from "#types/location.types";
import { TREE_FILE } from "#configuration/constants/location.constants";
import { isPathTree } from "#core/predicates/location.predicate";
import { join } from "node:path";
import { parse } from "yaml";
import { readFileSync } from "node:fs";

const MEMBER_DIR = join(import.meta.dirname, "..", "..");

const loadTree = function loadTree(): PathTree {
    const parsed: unknown = parse(readFileSync(join(MEMBER_DIR, TREE_FILE), "utf8"));
    if (!isPathTree(parsed)) {
        throw new Error(INVALID_TREE);
    }
    return parsed;
};

export const LOCATION_TREE: PathTree = loadTree();
