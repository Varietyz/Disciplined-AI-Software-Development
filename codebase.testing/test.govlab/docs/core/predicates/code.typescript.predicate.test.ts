import { afterAll, describe, expect, it } from "vitest";
import { declId, mkNodeId, sourceOf } from "@govlab/docs/core/factories/code.typescript.factory.ts";
import { defined, programFor, sourceFileOf } from "../analyzers/program.fixture.ts";
import { inPackage, isFactoryName, isFunctionLike } from "@govlab/docs/core/predicates/code.typescript.predicate.ts";
import ts from "typescript";

const fixture = programFor({
    "a.ts": "export function createThing(): number {\n    return 1;\n}\nexport const value = 1;\n",
});
const statements = [...sourceFileOf(fixture, "a.ts").statements];
const fn = defined(statements.find(ts.isFunctionDeclaration), "function");
const statement = defined(statements.find(ts.isVariableStatement), "statement");

afterAll(() => {
    fixture.dispose();
});

describe("isFunctionLike, isFactoryName and inPackage", () => {
    it("classify function nodes, factory names and in-package declarations", () => {
        expect([isFunctionLike(fn), isFunctionLike(statement)]).toStrictEqual([true, false]);
        expect(["createThing", "create", "created", "makeThing"].map(isFactoryName)).toStrictEqual([
            true,
            false,
            false,
            false,
        ]);
        expect([inPackage(fn, fixture.analysis.dirPosix), inPackage(fn, "/elsewhere")]).toStrictEqual([true, false]);
    });
});

describe("the node identity factories", () => {
    it("derive a stable id from a node's position and a source reference from its line", () => {
        expect(mkNodeId(fn)).toBe(mkNodeId(fn));
        expect(declId(fn).startsWith("createThing_")).toBe(true);
        expect(sourceOf(fn).line).toBe(1);
    });
});
