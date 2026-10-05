import { EMISSION_CALL, RULE_DIR, STEP_DIR } from "coordination-surface/tools/core/constants/report.constants.ts";
import {
    claimedReportIds,
    emittedIds,
    stepEmittedIds,
} from "coordination-surface/tools/core/validators/emission.validator.ts";
import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("emittedIds", () => {
    it("reads each report id a source emits by its quoted second argument, once", () => {
        const source = [
            `${EMISSION_CALL}root, "gates", report);`,
            `${EMISSION_CALL}root, "gates", again);`,
            `${EMISSION_CALL}root, id, report);`,
        ].join("\n");
        assert.deepEqual(emittedIds(source), ["gates"]);
    });
});

describe("stepEmittedIds and claimedReportIds", () => {
    it("claim every step and rule by its file identity, plus the ids their sources emit", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-emission-"));
        try {
            mkdirSync(resolve(root, STEP_DIR), { recursive: true });
            mkdirSync(resolve(root, RULE_DIR), { recursive: true });
            writeVerbatim(resolve(root, STEP_DIR, "gate.step.ts"), `${EMISSION_CALL}root, "certificate", report);`);
            writeVerbatim(resolve(root, RULE_DIR, "board.rule.ts"), "export {};");
            writeVerbatim(resolve(root, RULE_DIR, "notes.md"), "");
            assert.deepEqual(stepEmittedIds(root), ["gate", "certificate"]);
            assert.deepEqual([...claimedReportIds(root)], ["gate", "certificate", "board"]);
            assert.deepEqual(stepEmittedIds(join(root, "absent")), []);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
