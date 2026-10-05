import {
    bearsSecret,
    isPlaceholder,
    parseShapes,
    tokensOf,
} from "coordination-surface/tools/core/predicates/secret.predicate.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const SHAPES = parseShapes(["key_:12", "broken", "zero:0"]);

describe("parseShapes", () => {
    it("reads a prefix and a minimum length, skipping malformed entries", () => {
        assert.deepEqual(SHAPES, [{ minimumLength: 12, prefix: "key_" }]);
    });
});

describe("tokensOf and isPlaceholder", () => {
    it("splits on anything but word characters and hyphens, and knows a repeated filler", () => {
        assert.deepEqual(tokensOf("a=key_x-1, b"), ["a", "key_x-1", "b"]);
        assert.equal(isPlaceholder("xxxx-xxxx"), true);
        assert.equal(isPlaceholder("x1y2"), false);
        assert.equal(isPlaceholder("--"), false);
    });
});

describe("bearsSecret", () => {
    it("finds a token of the declared shape and ignores short tokens and placeholders", () => {
        assert.equal(bearsSecret("token = key_a1b2c3d4e5", SHAPES), true);
        assert.equal(bearsSecret("token = key_short", SHAPES), false);
        assert.equal(bearsSecret("token = key_xxxxxxxxxx", SHAPES), false);
        assert.equal(bearsSecret("no prefix here", SHAPES), false);
    });
});
