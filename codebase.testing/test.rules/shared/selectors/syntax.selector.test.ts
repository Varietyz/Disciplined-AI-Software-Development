import {
    argumentAt,
    asNode,
    booleanAt,
    calleeName,
    exportedNamesOf,
    handlerKey,
    isAstNode,
    isType,
    literalString,
    locOf,
    nameOf,
    nodeAt,
    nodesAt,
    numberAt,
    propertyKeyName,
    recordAt,
    staticTextOf,
    stringAt,
    stringIn,
    typeOf,
    walk,
} from "@ssot/govlab/shared/selectors/syntax.selector.ts";
import { describe, expect, it } from "vitest";
import type { AstNode } from "@ssot/govlab/types/syntax.types.ts";
import { Linter } from "eslint";
import { listener } from "@ssot/govlab/shared/factories/listener.factory.ts";

const linter = new Linter();
const SIMPLE_DECLARATION = "const a = 1;";

const programOf = function programOf(code: string): AstNode {
    let program: unknown = null;
    const capture = {
        create() {
            return listener({
                program(_view, node) {
                    program = node;
                },
            });
        },
        meta: { messages: {}, schema: [], type: "problem" as const },
    };
    linter.verify(
        code,
        [
            {
                files: ["**/*.ts"],
                languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
                plugins: { t: { rules: { r: capture } } },
                rules: { "t/r": "error" as const },
            },
        ],
        "probe.ts",
    );
    const node = asNode(program);
    if (node === null) {
        throw new Error("the capture rule did not observe a Program node");
    }
    return node;
};

const firstStatement = function firstStatement(code: string): AstNode {
    const [statement] = nodesAt(programOf(code), "body");
    if (statement === undefined) {
        throw new Error("no statement parsed");
    }
    return statement;
};

describe("isAstNode and asNode", () => {
    it("accepts a parsed node and refuses anything without a type and a location", () => {
        expect(isAstNode(programOf(SIMPLE_DECLARATION))).toBe(true);
        expect(isAstNode({ type: "Literal" })).toBe(false);
        expect(isAstNode({ loc: {} })).toBe(false);
        expect(isAstNode(null)).toBe(false);
        expect(asNode("text")).toBeNull();
    });

    it("refuses a plain record that carries no type, which is why value maps need recordAt", () => {
        expect(isAstNode({ cooked: "x", raw: "x" })).toBe(false);
    });
});

describe("member accessors", () => {
    it("reads a child node, a child list and a string member", () => {
        const declaration = firstStatement(SIMPLE_DECLARATION);
        expect(typeOf(declaration)).toBe("VariableDeclaration");
        expect(stringAt(declaration, "kind")).toBe("const");
        expect(nodesAt(declaration, "declarations")).toHaveLength(1);
        expect(nodeAt(declaration, "missing")).toBeNull();
    });

    it("reads numbers and booleans, and reports absence rather than guessing", () => {
        const expression = nodeAt(firstStatement(SIMPLE_DECLARATION), "declarations");
        expect(expression).toBeNull();
        const literal = nodeAt(nodesAt(firstStatement(SIMPLE_DECLARATION), "declarations")[0] ?? null, "init");
        expect(numberAt(literal, "value")).toBe(1);
        expect(numberAt(literal, "missing")).toBeNull();
        expect(booleanAt(literal, "missing")).toBe(false);
    });

    it("reads a plain record hanging off a node", () => {
        const statement = firstStatement("const a = `text`;");
        const template = nodeAt(nodesAt(statement, "declarations")[0] ?? null, "init");
        const [quasi] = nodesAt(template, "quasis");
        expect(stringIn(recordAt(quasi ?? null, "value"), "cooked")).toBe("text");
        expect(stringIn(null, "cooked")).toBe("");
    });
});

describe("name and literal readers", () => {
    it("reads an identifier name and a string literal, and separates the two", () => {
        const statement = firstStatement('const label = "hello";');
        const declarator = nodesAt(statement, "declarations")[0] ?? null;
        expect(nameOf(nodeAt(declarator, "id"))).toBe("label");
        expect(literalString(nodeAt(declarator, "init"))).toBe("hello");
        expect(literalString(nodeAt(declarator, "id"))).toBeNull();
    });

    it("returns null for a non-string literal", () => {
        const declarator = nodesAt(firstStatement(SIMPLE_DECLARATION), "declarations")[0] ?? null;
        expect(literalString(nodeAt(declarator, "init"))).toBeNull();
    });

    it("reads static text from a string literal or an expressionless template, and nothing from a computed one", () => {
        const plain = nodesAt(firstStatement(`const a = "hello";`), "declarations")[0] ?? null;
        const template = nodesAt(firstStatement("const a = `hello`;"), "declarations")[0] ?? null;
        const computedSource = ["const a = `hello $", "{b}`;"].join("");
        const computed = nodesAt(firstStatement(computedSource), "declarations")[0] ?? null;
        expect(staticTextOf(nodeAt(plain, "init"))).toBe("hello");
        expect(staticTextOf(nodeAt(template, "init"))).toBe("hello");
        expect(staticTextOf(nodeAt(computed, "init"))).toBeNull();
        expect(staticTextOf(null)).toBeNull();
    });
});

describe("call and property helpers", () => {
    it("names a free callee and a method callee alike", () => {
        const free = nodeAt(firstStatement("resolve(id);"), "expression");
        expect(calleeName(free)).toBe("resolve");
        const method = nodeAt(firstStatement("registry.resolve(id);"), "expression");
        expect(calleeName(method)).toBe("resolve");
    });

    it("reads a positional argument and reports absence past the end", () => {
        const call = nodeAt(firstStatement('resolve("first");'), "expression");
        expect(literalString(argumentAt(call, 0))).toBe("first");
        expect(argumentAt(call, 1)).toBeNull();
    });

    it("names a property key", () => {
        const object = nodeAt(nodesAt(firstStatement("const a = { label: 1 };"), "declarations")[0] ?? null, "init");
        const [property] = nodesAt(object, "properties");
        expect(propertyKeyName(property ?? null)).toBe("label");
    });
});

describe("isType and handlerKey", () => {
    it("compares a node's type without throwing on null", () => {
        expect(isType(firstStatement(SIMPLE_DECLARATION), "VariableDeclaration")).toBe(true);
        expect(isType(null, "VariableDeclaration")).toBe(false);
    });

    it("lowers a node type to its handler key so no rule spells a protocol key", () => {
        expect(handlerKey("CallExpression")).toBe("callExpression");
        expect(handlerKey("TSAsExpression")).toBe("tSAsExpression");
    });
});

describe("walk", () => {
    it("visits every node once and does not follow the parent back-reference", () => {
        const seen: string[] = [];
        walk(programOf(SIMPLE_DECLARATION), (node) => {
            seen.push(node.type);
        });
        expect(seen).toContain("VariableDeclarator");
        expect(seen).toHaveLength(new Set(seen.map((type, index) => `${type}:${index}`)).size);
    });
});

describe("exportedNamesOf", () => {
    it("names a declared const, function and class export", () => {
        const names = ["export const a = 1;", "export function b() {}", "export class C {}"].flatMap((code) =>
            exportedNamesOf(firstStatement(code)).map((entry) => entry.name),
        );
        expect(names).toStrictEqual(["a", "b", "C"]);
    });

    it("names a grouped specifier export", () => {
        const entries = exportedNamesOf(firstStatement("const a = 1; export { a as b };"));
        expect(entries.map((entry) => entry.name)).toStrictEqual([]);
        const grouped = nodesAt(programOf("const a = 1; export { a as b };"), "body")[1] ?? null;
        expect(grouped === null ? [] : exportedNamesOf(grouped).map((entry) => entry.name)).toStrictEqual(["b"]);
    });

    it("carries a reportable location for each name", () => {
        const [entry] = exportedNamesOf(firstStatement("export const a = 1;"));
        expect(entry === undefined ? null : locOf(entry.target).start.line).toBe(1);
    });
});
