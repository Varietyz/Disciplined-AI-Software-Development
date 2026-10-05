import {
    ROW_INCOMPLETE,
    contractMissing,
    idTaken,
    noTaskRows,
    planMissing,
    rowAppended,
} from "coordination-surface/tools/core/strings/task.strings.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { PLANNING_TEMPLATE } from "coordination-surface/tools/core/constants/checklist.constants.ts";
import assert from "node:assert/strict";
import { runTask } from "coordination-surface/tools/core/runners/task.runner.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const PLAN = "plan.txt";

describe("runTask", () => {
    it("appends a task row after the last one with the contract's fields, and refuses what it cannot write", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-task-"));
        try {
            const request = { id: "T2", owner: "B", repoRoot, statement: "write the index", target: PLAN };
            assert.deepEqual(runTask(request), { code: 2, message: planMissing(PLAN) });
            writeVerbatim(join(repoRoot, PLAN), "# Plan\n");
            assert.deepEqual(runTask({ ...request, id: " " }), { code: 2, message: ROW_INCOMPLETE });
            assert.deepEqual(runTask(request), { code: 2, message: noTaskRows(PLAN) });
            writeVerbatim(join(repoRoot, PLAN), "# Plan\n- [ ] T1 read the board\n");
            assert.deepEqual(runTask({ ...request, id: "T1" }), { code: 2, message: idTaken("T1", PLAN) });
            assert.deepEqual(runTask(request), { code: 2, message: contractMissing(PLANNING_TEMPLATE) });
            const template = resolve(repoRoot, PLANNING_TEMPLATE);
            mkdirSync(dirname(template), { recursive: true });
            writeVerbatim(
                template,
                ["| field | rendered as |", "|---|---|", "| owner | `*owner:*` |", "| file | `*file:*` |"].join("\n"),
            );
            assert.deepEqual(runTask(request), { code: 0, message: rowAppended("T2", PLAN) });
            assert.ok(
                readFileSync(join(repoRoot, PLAN), "utf8").includes(
                    "- [ ] T2 write the index. *owner:* B · *file:* <unwritten>",
                ),
            );
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
