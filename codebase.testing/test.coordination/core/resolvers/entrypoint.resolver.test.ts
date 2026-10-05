import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { presenceBackedMutationGuards } from "coordination-surface/tools/core/resolvers/entrypoint.resolver.ts";

const SOURCE = [
    "const quiet = activeSeats(board).length === 0;",
    "const heal = quiet;",
    "runPipeline({",
    "    fix: heal,",
    "});",
].join("\n");

describe("presenceBackedMutationGuards", () => {
    it("follows a mutation guard through the declarations it reads until it reaches a presence reader", () => {
        assert.deepEqual(presenceBackedMutationGuards(SOURCE, ["fix"], ["activeSeats"], 4), [
            { chain: ["heal", "quiet", "activeSeats"], guard: "heal", line: 4, reader: "activeSeats" },
        ]);
    });

    it("stops at the declared depth, and ignores a guard that never reaches a presence reader", () => {
        assert.deepEqual(presenceBackedMutationGuards(SOURCE, ["fix"], ["activeSeats"], 1), []);
        assert.deepEqual(presenceBackedMutationGuards(SOURCE, ["fix"], ["writingSeats"], 4), []);
    });
});
