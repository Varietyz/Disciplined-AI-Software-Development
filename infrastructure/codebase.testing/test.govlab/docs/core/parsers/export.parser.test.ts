import { barrelExports, exportedNames } from "@govlab/docs/core/parsers/export.parser.ts";
import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

const PARSER = join(absolutePath("govlab.docs"), "core", "parsers", "export.parser.ts");
const BARREL = join(absolutePath("govlab.docs"), "index.ts");

describe("exportedNames", () => {
    it("reads the exported names of a source file and omits the internal ones", () => {
        const names = exportedNames(PARSER);
        expect(names.has("exportedNames")).toBe(true);
        expect(names.has("barrelExports")).toBe(true);
        expect(names.has("sourceOf")).toBe(false);
    });
});

describe("barrelExports", () => {
    it("reads each re-exported value of a barrel", () => {
        const names = barrelExports(BARREL).map((entry) => entry.name);
        expect(names).toContain("computeLocation");
        expect(names).toContain("createModuleDocs");
    });
});
