import { describe, expect, it } from "vitest";
import {
    errorMessageSink,
    renderableTextAssignment,
    setAttributeLiteral,
    sinkLiteral,
    terminalSink,
} from "@ssot/govlab/shared/selectors/sink.selector.ts";
import type { AstNode } from "@ssot/govlab/types/syntax.types.ts";

const LOC = { end: { column: 1, line: 1 }, start: { column: 0, line: 1 } };

const MESSAGE: AstNode = { loc: LOC, type: "Literal", value: "x" };

const identifier = function identifier(name: string): AstNode {
    return { loc: LOC, name, type: "Identifier" };
};

const member = function member(object: AstNode, property: string): AstNode {
    return { loc: LOC, object, property: identifier(property), type: "MemberExpression" };
};

const nodeOf = function nodeOf(type: string, callee: AstNode, args: readonly AstNode[]): AstNode {
    return { arguments: args, callee, loc: LOC, type };
};

describe("errorMessageSink", () => {
    it("names the error constructor and hands back its message, and ignores any other constructor", () => {
        const error = nodeOf("NewExpression", identifier("TypeError"), [MESSAGE]);
        expect(errorMessageSink(error)).toStrictEqual({ argument: MESSAGE, sink: "TypeError" });
        const map = nodeOf("NewExpression", identifier("Map"), []);
        expect(errorMessageSink(map)).toBeNull();
    });
});

describe("terminalSink", () => {
    it("names the stream or console method a call writes to, and ignores any other call", () => {
        const stderr = member(identifier("process"), "stderr");
        const stream = nodeOf("CallExpression", member(stderr, "write"), [MESSAGE]);
        const logged = nodeOf("CallExpression", member(identifier("console"), "log"), [MESSAGE]);
        const file = nodeOf("CallExpression", member(identifier("file"), "write"), [MESSAGE]);
        expect(terminalSink(stream)?.sink).toBe("stderr");
        expect(terminalSink(logged)?.sink).toBe("log");
        expect(terminalSink(file)).toBeNull();
    });
});

const asCopy = (node: AstNode | null): AstNode | null => node;

const literal = function literal(value: string): AstNode {
    return { loc: LOC, type: "Literal", value };
};

describe("sinkLiteral", () => {
    it("pairs a found sink with the copy its argument resolves to, and passes a missing sink or copy", () => {
        expect(sinkLiteral({ argument: MESSAGE, sink: "stderr" }, asCopy)).toStrictEqual({
            keyName: "stderr",
            value: MESSAGE,
        });
        expect(sinkLiteral(null, asCopy)).toBeNull();
        expect(sinkLiteral({ argument: null, sink: "stderr" }, asCopy)).toBeNull();
    });
});

describe("renderableTextAssignment", () => {
    it("reports copy assigned to a node's text, and passes any other assignment", () => {
        const text = member(identifier("node"), "textContent");
        const assigned: AstNode = { left: text, loc: LOC, operator: "=", right: MESSAGE, type: "AssignmentExpression" };
        expect(renderableTextAssignment(assigned, asCopy)).toStrictEqual({ keyName: "textContent", value: MESSAGE });
        const other: AstNode = { ...assigned, left: member(identifier("node"), "id") };
        expect(renderableTextAssignment(other, asCopy)).toBeNull();
        expect(renderableTextAssignment({ ...assigned, operator: "+=" }, asCopy)).toBeNull();
    });
});

describe("setAttributeLiteral", () => {
    it("reports copy written to a user-visible attribute, and passes any other attribute", () => {
        const call = (name: string): AstNode => ({
            arguments: [literal(name), MESSAGE],
            callee: member(identifier("node"), "setAttribute"),
            loc: LOC,
            type: "CallExpression",
        });
        expect(setAttributeLiteral(call("title"), asCopy)).toStrictEqual({ keyName: "title", value: MESSAGE });
        expect(setAttributeLiteral(call("id"), asCopy)).toBeNull();
    });
});
