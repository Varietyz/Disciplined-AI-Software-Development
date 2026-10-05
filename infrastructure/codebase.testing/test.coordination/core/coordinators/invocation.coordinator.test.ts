import { describe, it } from "vitest";
import {
    extract,
    surfaceRaise,
    transition,
} from "coordination-surface/tools/core/coordinators/invocation.coordinator.ts";
import { EXTRACT_NEEDS_BODY } from "coordination-surface/tools/core/strings/board.strings.ts";
import { SEAT_STATES } from "coordination-surface/tools/core/runners/index.runner.ts";
import assert from "node:assert/strict";
import { declaredSubjects } from "coordination-surface/tools/core/runners/surface.runner.ts";
import { subjectUndeclared } from "coordination-surface/tools/core/strings/surface.strings.ts";
import { unknownState } from "coordination-surface/tools/core/strings/index.strings.ts";

const withArgv = function withArgv<T>(argv: readonly string[], read: () => T): T {
    const held = process.argv;
    process.argv = ["node", "board.entrypoint.ts", ...argv];
    try {
        return read();
    } finally {
        process.argv = held;
    }
};

const INVOCATION = { absolute: "", caller: "A", target: "" };

describe("the archive, surface and index forms", () => {
    it("answer nothing without their flag, and refuse before writing when an operand is missing or undeclared", () => {
        withArgv([], () => {
            assert.equal(extract(), null);
            assert.equal(surfaceRaise(), null);
            assert.equal(transition(INVOCATION), null);
        });
        assert.deepEqual(
            withArgv(["--extract", "lost-update"], () => extract()),
            { code: 2, message: EXTRACT_NEEDS_BODY },
        );
        assert.deepEqual(
            withArgv(["--model", "undeclared-probe"], () => surfaceRaise()),
            { code: 2, message: subjectUndeclared("undeclared-probe", declaredSubjects()) },
        );
        assert.deepEqual(
            withArgv(["--transition", "GONE"], () => transition(INVOCATION)),
            { code: 2, message: unknownState("GONE", SEAT_STATES) },
        );
    });
});
