import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { readBoardContract } from "coordination-surface/tools/core/readers/board.reader.ts";

describe("readBoardContract", () => {
    it("reads the placeholder fields under the first agent and gate anchors, stopping at the first other line", () => {
        const template = [
            "Agent <letter> — <STATE>",
            "  Owns: <paths>",
            "  Flags: —",
            "  Note: filled in",
            "  Refs: <refs>",
            "",
            "Gate <id> — <state>",
            "  State: <v>",
            "",
            "Agent <second> — <STATE>",
            "  Extra: <v>",
        ].join("\n");
        assert.deepEqual(readBoardContract(template), { agentFields: ["Owns", "Flags"], gateFields: ["State"] });
    });

    it("reads nothing from a template that declares no record", () => {
        assert.deepEqual(readBoardContract("prose"), { agentFields: [], gateFields: [] });
    });
});
