import type { AnatomyStats } from "@banes-lab/web/types/anatomy.types.js";
import type { TreeOptions } from "#types/anatomy.types";

export const UNQUALIFIED: TreeOptions = {
    qualifyPath: (_tab, path) => path,
    record: null,
    refer: null,
    specifiers: null,
};

export const EMPTY_STATS: AnatomyStats = {
    bytes: 0,
    callable: 0,
    definitions: 0,
    edges: 0,
    exported: 0,
    files: 0,
    findings: {},
    flows: {},
    lines: { blank: 0, code: 0, total: 0 },
};
