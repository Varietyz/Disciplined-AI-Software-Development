import {
    isArray,
    isDefineFragmentCall,
    isNode,
    isRecord,
    isRuleNode,
} from "@govlab/quality/core/predicates/context.fragment.predicate.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("isRecord accepts objects and rejects null and primitives", () => {
    assert.equal(isRecord({}), true);
    assert.equal(isRecord(null), false);
    assert.equal(isRecord("x"), false);
});

test("isNode and isRuleNode narrow AST-like values", () => {
    assert.equal(isNode({ type: "Identifier" }), true);
    assert.equal(isNode(null), false);
    assert.equal(isNode({}), false);
    assert.equal(isRuleNode({ type: "Literal" }), true);
});

test("isArray narrows arrays only", () => {
    assert.equal(isArray([]), true);
    assert.equal(isArray({ length: 0 }), false);
});

test("isDefineFragmentCall recognizes the fragment factory call", () => {
    assert.equal(
        isDefineFragmentCall({ callee: { name: "defineContextFragment", type: "Identifier" }, type: "CallExpression" }),
        true,
    );
    assert.equal(
        isDefineFragmentCall({ callee: { name: "other", type: "Identifier" }, type: "CallExpression" }),
        false,
    );
});
