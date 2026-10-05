import type { AnatomyIndex } from "@banes-lab/web/types/record.types.js";
import type { DerivedTree } from "#types/anatomy.types";

export const renderAnatomyIndex = function renderAnatomyIndex(index: AnatomyIndex): string {
    return [
        'import type { AnatomyIndex } from "#types/record.types";',
        "",
        `export const ANATOMY_INDEX: AnatomyIndex = JSON.parse(${JSON.stringify(JSON.stringify(index))});`,
        "",
    ].join("\n");
};

export const renderAnatomy = function renderAnatomy(trees: readonly DerivedTree[]): string {
    return [
        'import type { AnatomySnapshot } from "#types/anatomy.types";',
        "",
        ...trees.flatMap((tree) => [
            `export const ${tree.exportName}: AnatomySnapshot = JSON.parse(${JSON.stringify(JSON.stringify(tree.snapshot))});`,
            "",
        ]),
        "export const ANATOMY_SNAPSHOTS: ReadonlyMap<string, AnatomySnapshot> = new Map([",
        ...trees.map((tree) => `    [${JSON.stringify(tree.tab)}, ${tree.exportName}],`),
        "]);",
        "",
    ].join("\n");
};
