import { expect, test } from "vitest";
import { isConstructInit, isDefaultConstruct } from "@govlab/quality/core/predicates/construct.predicate.ts";

test("isConstructInit accepts functions, method objects, instances and factory results", () => {
    expect(isConstructInit({ type: "ArrowFunctionExpression" })).toBe(true);
    expect(isConstructInit({ properties: [{ method: true, type: "Property" }], type: "ObjectExpression" })).toBe(true);
    expect(isConstructInit({ callee: { name: "Parser", type: "Identifier" }, type: "NewExpression" })).toBe(true);
    expect(isConstructInit({ callee: { name: "createStore", type: "Identifier" }, type: "CallExpression" })).toBe(true);
});

test("isConstructInit refuses data constructors, plain calls and missing inits", () => {
    expect(isConstructInit({ callee: { name: "Map", type: "Identifier" }, type: "NewExpression" })).toBe(false);
    expect(isConstructInit({ callee: { name: "create", type: "Identifier" }, type: "CallExpression" })).toBe(false);
    expect(isConstructInit({ type: "Literal" })).toBe(false);
    expect(isConstructInit(null)).toBe(false);
});

test("isDefaultConstruct accepts a declared function or class and a construct expression", () => {
    expect(isDefaultConstruct({ type: "FunctionDeclaration" })).toBe(true);
    expect(isDefaultConstruct({ type: "ClassDeclaration" })).toBe(true);
    expect(isDefaultConstruct({ type: "FunctionExpression" })).toBe(true);
    expect(isDefaultConstruct({ type: "Literal" })).toBe(false);
    expect(isDefaultConstruct()).toBe(false);
});
