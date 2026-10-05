export const INVALID_TREE = "@ssot/paths: paths.yaml did not parse to a valid path tree";

export const INVALID_ABSOLUTE_TREE = "@ssot/paths: absolutized tree is not a valid path tree";

export const unknownKey = function unknownKey(key: string): string {
    return `@ssot/paths: unknown path key "${key}"`;
};

export const branchWithoutLocation = function branchWithoutLocation(key: string): string {
    return `@ssot/paths: path key "${key}" is a branch with no own location`;
};

export const descendsThroughLeaf = function descendsThroughLeaf(key: string): string {
    return `@ssot/paths: path key "${key}" descends through a leaf`;
};

export const rootNotFound = function rootNotFound(name: string): string {
    return `@ssot/paths: workspace root (package.json name '${name}') not found above this package`;
};
