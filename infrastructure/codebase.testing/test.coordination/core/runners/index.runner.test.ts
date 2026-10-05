import {
    ROLE_MISSING,
    ROW_SECTION_MISSING,
    alreadyInState,
    foreignWithoutReason,
    malformedRow,
    rowAdded,
    stateChanged,
    unboundLetter,
    unknownState,
} from "coordination-surface/tools/core/strings/index.strings.ts";
import { SEAT_STATES, runIndex, runTransition } from "coordination-surface/tools/core/runners/index.runner.ts";
import { afterAll, beforeAll, describe, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const INDEX = ["═══ INDEX ═══", "| A | governance | ACTIVE |", "| C |", "═══ END ═══"].join("\n");

describe("the index runners", () => {
    let root = "";
    let absolute = "";

    beforeAll(() => {
        root = mkdtempSync(join(tmpdir(), "coordination-index-"));
        absolute = join(root, "index.txt");
    });

    afterAll(() => {
        rmSync(root, { force: true, recursive: true });
    });

    it("runIndex binds the shortest free letter to a role, and refuses an empty role or an index with no row section", () => {
        writeVerbatim(absolute, "# no section\n");
        assert.deepEqual(runIndex({ absolute, role: " " }), { code: 2, message: ROLE_MISSING });
        assert.deepEqual(runIndex({ absolute, role: "document" }), { code: 2, message: ROW_SECTION_MISSING });
        writeVerbatim(absolute, INDEX);
        assert.deepEqual(runIndex({ absolute, role: "document" }), { code: 0, message: rowAdded("B", "document") });
        assert.ok(readFileSync(absolute, "utf8").includes("| B | document | ACTIVE |"));
    });

    it("runTransition moves a seat's own state, records a peer's move with its warrant, and refuses what it cannot state", () => {
        writeVerbatim(absolute, INDEX);
        const own = { absolute, by: "A", letter: "A", state: "INACTIVE", warrant: null };
        assert.deepEqual(runTransition({ ...own, state: "GONE" }), {
            code: 2,
            message: unknownState("GONE", SEAT_STATES),
        });
        assert.deepEqual(runTransition({ ...own, by: "B" }), { code: 2, message: foreignWithoutReason("B", "A") });
        assert.deepEqual(runTransition({ ...own, by: "Z", letter: "Z" }), { code: 2, message: unboundLetter("Z") });
        assert.deepEqual(runTransition({ ...own, by: "C", letter: "C" }), { code: 2, message: malformedRow("C") });
        assert.deepEqual(runTransition(own), { code: 0, message: stateChanged("A", "INACTIVE", null) });
        assert.deepEqual(runTransition(own), { code: 0, message: alreadyInState("A", "INACTIVE") });
        const warranted = { ...own, by: "B", state: "ACTIVE", warrant: "the venue converged" };
        assert.deepEqual(runTransition(warranted), { code: 0, message: stateChanged("A", "ACTIVE", "B") });
        assert.ok(readFileSync(absolute, "utf8").includes("> A moved to ACTIVE by B under the venue converged"));
    });
});
