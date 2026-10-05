import { describe, it } from "vitest";
import { fieldOf, narrow, parseJson, readJson, tryParse } from "coordination-surface/tools/core/readers/json.reader.ts";
import assert from "node:assert/strict";
import { isObject } from "coordination-surface/tools/core/predicates/schema.predicate.ts";

describe("tryParse and fieldOf", () => {
    it("parses without throwing, telling a failed parse from a parsed null, and reads an own field", () => {
        assert.deepEqual(tryParse("null"), { value: null });
        assert.equal(tryParse("{"), null);
        assert.equal(fieldOf({ a: 1 }, "a"), 1);
        assert.equal(fieldOf({ a: 1 }, "toString"), undefined);
    });
});

describe("parseJson, narrow and readJson", () => {
    it("parses and narrows JSON, naming the origin when either step fails", () => {
        assert.deepEqual(readJson('{"a":1}', isObject, "a.json", "an object"), { a: 1 });
        assert.throws(
            () => parseJson("{", "a.json"),
            (error: unknown) => error instanceof Error && error.message.startsWith("a.json is not readable JSON"),
        );
        assert.throws(() => narrow([], isObject, "a.json", "an object"), {
            message: "a.json does not satisfy an object",
        });
    });
});
