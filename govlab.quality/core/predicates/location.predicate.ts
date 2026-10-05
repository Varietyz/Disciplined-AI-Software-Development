import path from "node:path";

const PARENT_SEGMENT = "..";

export const isInsideRoot = function isInsideRoot(root: string, file: string): boolean {
    const inside = path.relative(root, path.resolve(root, file));
    return !path.isAbsolute(inside) && inside.split(path.sep)[0] !== PARENT_SEGMENT;
};
