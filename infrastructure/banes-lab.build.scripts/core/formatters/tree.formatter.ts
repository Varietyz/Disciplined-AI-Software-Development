import type { AnatomyTreeDeclaration } from "@banes-lab/web/types/anatomy.types.js";

const INDENT = 4;

export const renderTreeDeclarations = function renderTreeDeclarations(
    declarations: readonly AnatomyTreeDeclaration[],
): string {
    return [
        'import type { AnatomyTreeDeclaration } from "#types/anatomy.types";',
        "",
        `export const ANATOMY_TREE_DECLARATIONS: readonly AnatomyTreeDeclaration[] = ${JSON.stringify(declarations, null, INDENT)};`,
        "",
    ].join("\n");
};
