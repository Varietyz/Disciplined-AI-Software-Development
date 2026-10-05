import { describe, it } from "vitest";
import { unreadableJson, unsatisfiedShape } from "coordination-surface/tools/core/strings/json.strings.ts";
import assert from "node:assert/strict";

describe("the json reader messages", () => {
    it("name the origin and what failed", () => {
        assert.equal(unreadableJson("a.json", "bad token"), "a.json is not readable JSON: bad token");
        assert.equal(unsatisfiedShape("a.json", "an object"), "a.json does not satisfy an object");
    });
});
