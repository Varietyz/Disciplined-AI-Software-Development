import {
    MILESTONE_MARKER,
    PHASE_MARKER,
    TASK_MARKER,
} from "coordination-surface/tools/core/constants/checklist.constants.ts";
import {
    count,
    declaresContract,
    emptyPhases,
    historyIn,
    isTask,
    missingFields,
    taskBlocks,
} from "coordination-surface/tools/core/validators/checklist.validator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const PLAN = [
    `${MILESTONE_MARKER}1 Milestone`,
    `${PHASE_MARKER}1 With work`,
    "prose that argues",
    `${TASK_MARKER} 1.1.1 build it *file:* a.ts`,
    "  *evidence:* a test",
    "",
    `${PHASE_MARKER}2 Argued, no task`,
    "an argument nobody will close",
    `${PHASE_MARKER}3 Scaffold only`,
    "RIPPLE: none",
    `${MILESTONE_MARKER}2 Next`,
].join("\n");

const LINES = PLAN.split("\n");

describe("isTask, count and taskBlocks", () => {
    it("count milestones, phases and tasks, and join a task with its indented continuation lines", () => {
        assert.equal(isTask(`  ${TASK_MARKER} x`), true);
        assert.equal(isTask("- [x] done"), false);
        assert.deepEqual(count(LINES), { milestones: 2, phases: 3, tasks: 1 });
        assert.deepEqual(taskBlocks(LINES), [
            { line: 4, text: `${TASK_MARKER} 1.1.1 build it *file:* a.ts *evidence:* a test` },
        ]);
    });
});

describe("missingFields and declaresContract", () => {
    it("name the contract fields a task omits, and accept a checklist where one task carries them all", () => {
        const blocks = taskBlocks(LINES);
        assert.deepEqual(missingFields(blocks[0]?.text ?? "", ["*file:*", "*verifier:*"]), ["*verifier:*"]);
        assert.equal(declaresContract(blocks, ["*file:*", "*evidence:*"]), true);
        assert.equal(declaresContract(blocks, ["*verifier:*"]), false);
        assert.equal(declaresContract(blocks, []), false);
    });
});

describe("historyIn", () => {
    it("finds a history marker that closes a clause, and nothing where it runs into the sentence or is absent", () => {
        assert.equal(historyIn("Previously, the parser read each line twice."), "previously");
        assert.equal(historyIn("The parser was previously a regex."), null);
        assert.equal(historyIn("The parser reads each line once."), null);
    });
});

describe("emptyPhases", () => {
    it("names a phase that argues and holds no task, and passes one holding only what its contract mandates", () => {
        assert.deepEqual(emptyPhases(LINES, ["RIPPLE"]), [{ line: 7, title: "2 Argued, no task" }]);
        assert.deepEqual(
            emptyPhases(LINES).map((phase) => phase.line),
            [7, 9],
        );
    });
});
