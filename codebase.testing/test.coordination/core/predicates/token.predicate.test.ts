import { accumulate, isWordCharacter } from "coordination-surface/tools/core/predicates/token.predicate.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("isWordCharacter", () => {
    it("accepts letters, digits and the underscore", () => {
        assert.deepEqual(["a", "Z", "7", "_", "-", " ", ""].map(isWordCharacter), [
            true,
            true,
            true,
            true,
            false,
            false,
            false,
        ]);
    });
});

describe("accumulate", () => {
    it("collects the runs of characters the predicate accepts", () => {
        assert.deepEqual(accumulate("ab-cd  e", isWordCharacter), ["ab", "cd", "e"]);
        assert.deepEqual(accumulate("--", isWordCharacter), []);
    });
});
