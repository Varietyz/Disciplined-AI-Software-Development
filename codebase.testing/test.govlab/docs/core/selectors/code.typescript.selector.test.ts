import { afterAll, describe, expect, it } from "vitest";
import {
    communicationObjName,
    declName,
    firstDeclaration,
    functionOf,
    memberName,
    unionStringLiterals,
} from "@govlab/docs/core/selectors/code.typescript.selector.ts";
import { defined, programFor, sourceFileOf } from "../analyzers/program.fixture.ts";
import ts from "typescript";

const fixture = programFor({
    "a.ts": [
        'export type Mode = "a" | "b" | "c";',
        'export type Pair = "a" | "b";',
        "export const run = (): number => 1;",
        "export class Box { constructor() {} open(): void {} }",
        'import { run as alias } from "./a.ts";',
        "export const used = alias;",
    ].join("\n"),
});
const statements = [...sourceFileOf(fixture, "a.ts").statements];
const [mode, pair] = statements.filter(ts.isTypeAliasDeclaration);
const [runStatement, usedStatement] = statements.filter(ts.isVariableStatement);
const runDecl = defined(runStatement?.declarationList.declarations[0], "run");
const usedInit = defined(usedStatement?.declarationList.declarations[0]?.initializer, "used");
const box = defined(statements.find(ts.isClassDeclaration), "box");

afterAll(() => {
    fixture.dispose();
});

describe("unionStringLiterals", () => {
    it("reads a string union of at least three members", () => {
        expect(unionStringLiterals(defined(mode, "mode").type)).toStrictEqual(["a", "b", "c"]);
        expect(unionStringLiterals(defined(pair, "pair").type)).toBeNull();
    });
});

describe("functionOf, declName and memberName", () => {
    it("read the function behind a binding and the names of declarations and members", () => {
        expect(functionOf(runDecl)?.kind).toBe(ts.SyntaxKind.ArrowFunction);
        expect(functionOf(null)).toBeNull();
        expect(declName(runDecl)).toBe("run");
        expect(box.members.map(memberName)).toStrictEqual(["constructor", "open"]);
    });
});

describe("firstDeclaration and communicationObjName", () => {
    it("follow an alias to its declaration and name the object a call is made on", () => {
        const symbol = defined(fixture.analysis.checker.getSymbolAtLocation(usedInit), "symbol");
        const declaration = defined(firstDeclaration(symbol, fixture.analysis.checker), "declaration");
        expect(declName(declaration)).toBe("run");
        expect(communicationObjName(ts.factory.createIdentifier("store"))).toBe("store");
        const viaThis = ts.factory.createPropertyAccessExpression(ts.factory.createThis(), "#queue");
        expect(communicationObjName(viaThis)).toBe("queue");
        expect(communicationObjName(ts.factory.createStringLiteral("x"))).toBeNull();
    });
});
