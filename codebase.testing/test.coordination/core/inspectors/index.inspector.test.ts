import {
    activeSeatLetters,
    indexedLetters,
    indexedStates,
} from "coordination-surface/tools/core/inspectors/index.inspector.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const INDEX = [
    "| letter | role | state |",
    "|---|---|---|",
    "| A | governance | ACTIVE |",
    "| B | document | INACTIVE |",
    "| SAa | subagent | ACTIVE |",
    "| C | graph | |",
    "| A | projection | ACTIVE |",
    "prose naming | Z | outside a row",
].join("\n");

describe("activeSeatLetters", () => {
    it("reads each single-letter seat marked ACTIVE, once per row", () => {
        assert.deepEqual(activeSeatLetters(INDEX), ["A", "A"]);
    });
});

describe("indexedStates", () => {
    it("maps each single-letter seat to its stated state, the last row winning", () => {
        assert.deepEqual(
            [...indexedStates(INDEX)],
            [
                ["A", "ACTIVE"],
                ["B", "INACTIVE"],
            ],
        );
    });
});

describe("indexedLetters", () => {
    it("reads every bound letter, including subagent letters, and reports each repeat binding", () => {
        const { letters, duplicates } = indexedLetters(INDEX);
        assert.deepEqual([...letters], ["A", "B", "SAa", "C"]);
        assert.deepEqual(duplicates, ["A"]);
    });
});
