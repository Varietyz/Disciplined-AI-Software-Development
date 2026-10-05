import { SCHEDULE_DIVIDER, SCHEDULE_HEADER } from "coordination-surface/tools/core/constants/agenda.constants.ts";
import { describe, it } from "vitest";
import { oneLine, renderSchedule } from "coordination-surface/tools/core/formatters/agenda.formatter.ts";
import assert from "node:assert/strict";

describe("oneLine", () => {
    it("folds every run of line breaks, tabs and spaces into one space, and drops them at the ends", () => {
        assert.equal(oneLine("  first\n\n\tsecond   third \r\n"), "first second third");
        assert.equal(oneLine(""), "");
    });
});

describe("renderSchedule", () => {
    it("writes the header, the divider and one row per plan, naming a merge and a noted state", () => {
        const rows = renderSchedule([
            {
                derived: true,
                evidence: "",
                plan: { establishes: "one\nwriter", invariant: "single-writer", ordinal: "1" },
                state: "planned",
            },
            {
                derived: false,
                evidence: "",
                plan: { establishes: "x", invariant: "a", merged: "b", note: "held open", ordinal: "2" },
                state: "planned",
            },
        ]);
        assert.deepEqual(rows, [
            SCHEDULE_HEADER,
            SCHEDULE_DIVIDER,
            "| 1 | `single-writer` | one writer | planned |",
            "| 2 | `a` **merged with** `b` | x | `planned` — held open |",
        ]);
    });
});
