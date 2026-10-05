import { describe, expect, it } from "vitest";
import { specifierNodes, specifiersOf } from "@ssot/govlab/shared/selectors/specifier.selector.ts";
import ts from "typescript";

const CODE = [
    'import { a } from "./a.ts";',
    'import type { B } from "@scope/b";',
    'export { c } from "../c.ts";',
    'const d = await import("./d.ts");',
    'const e = "./not-a-specifier.ts";',
].join("\n");

describe("specifiersOf", () => {
    it("reads every import, re-export and dynamic import specifier, and no other string", () => {
        expect(specifiersOf("probe.ts", CODE)).toStrictEqual(["./a.ts", "@scope/b", "../c.ts", "./d.ts"]);
    });
});

describe("specifierNodes", () => {
    it("returns the literal nodes so a caller can report or rewrite at their position", () => {
        const source = ts.createSourceFile("probe.ts", CODE, ts.ScriptTarget.Latest, true);
        const [first] = specifierNodes(source);
        expect(first?.text).toBe("./a.ts");
        expect(first?.getStart(source)).toBe(CODE.indexOf('"./a.ts"'));
    });
});
