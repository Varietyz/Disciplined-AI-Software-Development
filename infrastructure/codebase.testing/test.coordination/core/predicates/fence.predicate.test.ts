import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { fencedFlags } from "coordination-surface/tools/core/predicates/fence.predicate.ts";

describe("fencedFlags", () => {
    it("flags the lines from an opening fence through its closing fence", () => {
        const source = ["prose", "```ts", "code", "```", "after"].join("\n");
        assert.deepEqual(fencedFlags(source), [false, true, true, true, false]);
    });

    it("keeps a fence open past a shorter run or a run followed by text", () => {
        const source = ["````", "```", "``` not a close", "````  ", "after"].join("\n");
        assert.deepEqual(fencedFlags(source), [true, true, true, true, false]);
    });

    it("does not open a fence on a run shorter than three", () => {
        assert.deepEqual(fencedFlags("``inline``\nprose"), [false, false]);
    });
});
