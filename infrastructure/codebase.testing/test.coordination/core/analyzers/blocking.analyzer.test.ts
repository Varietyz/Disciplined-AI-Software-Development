import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { ungatedRows } from "coordination-surface/tools/core/analyzers/blocking.analyzer.ts";

describe("ungatedRows", () => {
    it("reports a body row whose last cell is empty, reading the header for the width", () => {
        const source = [
            "| id | claim | gate |",
            "| --- | --- | :-: |",
            "| A-1 | a claim | venue-check |",
            "| A-2 | another |  |",
            "| A-3 | short |",
        ].join("\n");
        assert.deepEqual(ungatedRows(source), [{ id: "A-2", line: 4 }]);
    });

    it("starts a new table after a line that is not a row", () => {
        const source = ["| id | gate |", "| B-1 |  |", "prose between tables", "| id | gate |", "| C-1 |  |"].join(
            "\n",
        );
        assert.deepEqual(ungatedRows(source), [
            { id: "B-1", line: 2 },
            { id: "C-1", line: 5 },
        ]);
    });
});
