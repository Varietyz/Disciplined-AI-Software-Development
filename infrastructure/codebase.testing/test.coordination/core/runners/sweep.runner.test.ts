import {
    DISCHARGE_NEEDS_REF,
    dischargeNotVenue,
    dischargeRefUnresolved,
    dischargeRefUntyped,
    dischargeSettled,
    discharged,
} from "coordination-surface/tools/core/strings/board.strings.ts";
import { describe, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { runDischarge, runSweep } from "coordination-surface/tools/core/runners/sweep.runner.ts";
import { sweepHeld, swept } from "coordination-surface/tools/core/strings/sweep.strings.ts";
import { EXTRACTION_KIND } from "coordination-surface/tools/core/validators/archive.validator.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { recordDelivered } from "coordination-surface/tools/core/registries/snapshot.registry.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const item = function item(key: string, at: number, to: string): string[] {
    return [`┌─── AGENT ${key} at:${String(at)} to:${to}`, `body of ${key}`, `└─── END AGENT ${key}`];
};

const withRoot = function withRoot(check: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-sweep-run-"));
    try {
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("runSweep", () => {
    it("holds an item a reader was never handed, then archives and removes it once every reader was", () => {
        withRoot((root) => {
            const board = join(root, "board.txt");
            const archive = "history.txt";
            assert.deepEqual(runSweep(root, board, archive), { message: "", swept: [] });
            writeVerbatim(board, [...item("A-1", 100, "B"), ...item("B-1", 200, "A"), ""].join("\n"));
            assert.deepEqual(runSweep(root, board, archive), { message: sweepHeld(["A-1 → B"]), swept: [] });
            recordDelivered(root, "B", ["A-1"]);
            assert.deepEqual(runSweep(root, board, archive), { message: swept(["A-1"]), swept: ["A-1"] });
            assert.ok(!readFileSync(board, "utf8").includes("AGENT A-1"));
            assert.ok(readFileSync(join(root, archive), "utf8").includes("body of A-1"));
        });
    });
});

describe("runDischarge", () => {
    it("removes a directive once its extraction is filed, and refuses a target that is no venue or an unfiled reference", () => {
        withRoot((root) => {
            const target = "probe.blocking.md";
            const absolute = join(root, target);
            const archive = join(root, "history.txt");
            const ref = `${EXTRACTION_KIND}:the lost update`;
            const request = { absolute, archive, clause: "do the index", ref, target };
            assert.deepEqual(runDischarge({ ...request, target: "notes.md" }), {
                code: 2,
                message: dischargeNotVenue("notes.md"),
            });
            assert.deepEqual(runDischarge({ ...request, ref: null }), { code: 2, message: DISCHARGE_NEEDS_REF });
            assert.deepEqual(runDischarge({ ...request, ref: "loose" }), {
                code: 2,
                message: dischargeRefUntyped("loose"),
            });
            assert.deepEqual(runDischarge(request), { code: 2, message: dischargeRefUnresolved(ref) });
            writeVerbatim(archive, "### the lost update\n");
            writeVerbatim(
                absolute,
                ["# Venue", "## DIRECTIVES", "- do the index", "  and its row", "- keep this", "## POSITIONS"].join(
                    "\n",
                ),
            );
            assert.deepEqual(runDischarge({ ...request, clause: "absent" }), {
                code: 0,
                message: dischargeSettled(target, "absent"),
            });
            assert.deepEqual(runDischarge(request), { code: 0, message: discharged("do the index", target, ref) });
            assert.deepEqual(readFileSync(absolute, "utf8").split("\n"), [
                "# Venue",
                "## DIRECTIVES",
                "- keep this",
                "## POSITIONS",
            ]);
            assert.equal(existsSync(archive), true);
        });
    });
});
