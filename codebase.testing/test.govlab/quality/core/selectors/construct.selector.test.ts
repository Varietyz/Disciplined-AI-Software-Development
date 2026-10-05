import {
    asConstructNode,
    collectLocalConstructs,
    constructsOf,
} from "@govlab/quality/core/selectors/construct.selector.ts";
import { expect, test } from "vitest";

const FUNCTION_DECL = { id: { name: "run", type: "Identifier" }, type: "FunctionDeclaration" };
const VARIABLE_DECL = {
    declarations: [
        { id: { name: "handler", type: "Identifier" }, init: { type: "ArrowFunctionExpression" }, type: "X" },
        { id: { name: "limit", type: "Identifier" }, init: { type: "Literal" }, type: "X" },
    ],
    type: "VariableDeclaration",
};

test("asConstructNode narrows a typed record and refuses anything else", () => {
    expect(asConstructNode({ type: "Program" })).toStrictEqual({ type: "Program" });
    expect(asConstructNode(7)).toBeNull();
});

test("constructsOf names a declared function and each variable bound to a construct", () => {
    expect(constructsOf(FUNCTION_DECL).map((construct) => construct.name)).toStrictEqual(["run"]);
    expect(constructsOf(VARIABLE_DECL).map((construct) => construct.name)).toStrictEqual(["handler"]);
    expect(constructsOf(null)).toStrictEqual([]);
});

test("collectLocalConstructs reads exported and local declarations alike", () => {
    const body = [{ declaration: FUNCTION_DECL, type: "ExportNamedDeclaration" }, VARIABLE_DECL];
    expect([...collectLocalConstructs(body)].sort()).toStrictEqual(["handler", "run"]);
});
