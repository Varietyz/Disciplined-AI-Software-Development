import { describe, expect, it } from "vitest";
import { relativePath } from "@ssot/paths";
import { renderTreeDeclarations } from "@banes-lab/build-scripts/core/formatters/tree.formatter.ts";

describe("renderTreeDeclarations", () => {
    it("writes the declarations as one typed module export", () => {
        const folder = relativePath("app.member");
        const text = renderTreeDeclarations([
            {
                exportName: "ANATOMY",
                exports: [],
                folder,
                generatedSources: false,
                label: "Site",
                license: null,
                packageName: "@banes-lab/web",
                repository: null,
                tab: "tree",
            },
        ]);
        expect(text.startsWith('import type { AnatomyTreeDeclaration } from "#types/anatomy.types";')).toBe(true);
        expect(text).toContain("export const ANATOMY_TREE_DECLARATIONS: readonly AnatomyTreeDeclaration[] = [");
        expect(text).toContain(`"folder": ${JSON.stringify(folder)}`);
        expect(text.endsWith(";\n")).toBe(true);
    });
});
