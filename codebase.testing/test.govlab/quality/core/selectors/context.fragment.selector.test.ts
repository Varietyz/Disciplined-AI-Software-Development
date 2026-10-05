import {
    fragmentObject,
    identifierName,
    property,
    propertyNames,
    stringArrayValues,
    stringValue,
} from "@govlab/quality/core/selectors/context.fragment.selector.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const OBJECT = {
    properties: [
        { key: { name: "id" }, value: { type: "Literal", value: "x" } },
        { key: { value: "concern" }, value: { type: "Literal", value: "y" } },
    ],
    type: "ObjectExpression",
};

test("propertyNames collects identifier and string keys from an object node", () => {
    const names = propertyNames(OBJECT);
    assert.equal(names.has("id"), true);
    assert.equal(names.has("concern"), true);
});

test("property returns the value node of a named key and null for an absent one", () => {
    assert.deepEqual(property(OBJECT, "concern"), { type: "Literal", value: "y" });
    assert.equal(property(OBJECT, "body"), null);
});

test("stringValue reads a string literal node and rejects others", () => {
    assert.equal(stringValue({ type: "Literal", value: "hello" }), "hello");
    assert.equal(stringValue({ name: "x", type: "Identifier" }), null);
    assert.equal(stringValue(null), null);
});

test("stringArrayValues collects string literals from an array node", () => {
    const node = {
        elements: [
            { type: "Literal", value: "a" },
            { type: "Literal", value: "b" },
            { name: "skip", type: "Identifier" },
        ],
        type: "ArrayExpression",
    };
    assert.deepEqual(stringArrayValues(node), ["a", "b"]);
});

test("identifierName reads an Identifier node name", () => {
    assert.equal(identifierName({ name: "foo", type: "Identifier" }), "foo");
    assert.equal(identifierName({ type: "Literal", value: "x" }), null);
});

test("fragmentObject returns the first ObjectExpression argument", () => {
    const object = { properties: [], type: "ObjectExpression" };
    assert.equal(fragmentObject({ arguments: [object], type: "CallExpression" }), object);
    assert.equal(fragmentObject({ arguments: [], type: "CallExpression" }), null);
});
