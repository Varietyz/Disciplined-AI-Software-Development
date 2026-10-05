import { fieldValue, valuesAt } from "@govlab/context/core/selectors/field.selector.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("fieldValue reads a dotted path and yields undefined past a missing step", () => {
    assert.equal(fieldValue({ a: { b: "c" } }, "a.b"), "c");
    assert.equal(fieldValue({ a: "flat" }, "a.b"), undefined);
    assert.equal(fieldValue(null, "a"), undefined);
});

test("fieldValue steps into every entry of a record list and skips entries without the key", () => {
    const record = { steps: [{ record: "a" }, { stage: "s" }, { record: "b" }] };
    assert.deepEqual(fieldValue(record, "steps.record"), ["a", "b"]);
    assert.deepEqual(fieldValue({ steps: [] }, "steps.record"), []);
});

test("valuesAt answers a string, a string list or nothing as a list", () => {
    assert.deepEqual(valuesAt({ a: "one" }, "a"), ["one"]);
    assert.deepEqual(valuesAt({ a: ["one", "two"] }, "a"), ["one", "two"]);
    assert.deepEqual(valuesAt({ a: { b: 1 } }, "a"), []);
    assert.deepEqual(valuesAt({ steps: [{ record: "a" }] }, "steps.record"), ["a"]);
});
