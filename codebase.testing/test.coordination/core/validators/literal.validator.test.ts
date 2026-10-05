import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { countLiterals } from "coordination-surface/tools/core/validators/literal.validator.ts";

describe("countLiterals", () => {
    it("reports a numeral followed by a derived noun, outside code spans and fences", () => {
        const lines = [
            "This checklist holds 12 tasks across 3 phases.",
            "Version 1.2 rules nothing, and `4 rules` is quoted.",
            "```",
            "5 files",
            "```",
            "Seven rules is spelled out.",
        ];
        assert.deepEqual(countLiterals(lines), [
            { line: 1, noun: "tasks", numeral: "12" },
            { line: 1, noun: "phases", numeral: "3" },
        ]);
    });
});
