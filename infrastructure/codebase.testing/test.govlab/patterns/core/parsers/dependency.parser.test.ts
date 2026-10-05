import { describe, expect, it } from "vitest";
import { codeImports } from "@govlab/patterns/core/parsers/dependency.parser.ts";
import { parseCode } from "@govlab/code-parse";

const SOURCE =
    'import { greet as sayHi, other } from "@scope/foo";\nimport def from "./x.ts";\nimport { a } from \'./one.ts\';\n';

describe("codeImports", () => {
    it("reads each named import's quote-stripped source and imported names, skipping default imports", async () => {
        const root = await parseCode(SOURCE, "typescript");
        const bindings = root === null ? [] : codeImports(root);
        expect(bindings).toStrictEqual([
            { importedNames: ["greet", "other"], source: "@scope/foo" },
            { importedNames: ["a"], source: "./one.ts" },
        ]);
    });
});
