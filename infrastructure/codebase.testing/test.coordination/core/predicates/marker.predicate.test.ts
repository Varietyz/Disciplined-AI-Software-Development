import { describe, it } from "vitest";
import { forgedBoundaries, isClassHeading } from "coordination-surface/tools/core/predicates/marker.predicate.ts";
import assert from "node:assert/strict";

describe("isClassHeading", () => {
    it("accepts a kebab heading of lowercase letters, digits and hyphens, and nothing else", () => {
        assert.equal(isClassHeading("lost-update-2"), true);
        assert.equal(isClassHeading("Lost update"), false);
        assert.equal(isClassHeading("lost_update"), false);
        assert.equal(isClassHeading(""), false);
    });
});

describe("forgedBoundaries", () => {
    it("reports each line of a body that would open a fence or a span", () => {
        const body = ["plain text", "  ```ts", "┌─── AGENT A-9", "└─── END AGENT A-9", "`` two ticks"].join("\n");
        assert.deepEqual(
            forgedBoundaries(body).map((boundary) => boundary.line),
            [2, 3, 4],
        );
    });
});
