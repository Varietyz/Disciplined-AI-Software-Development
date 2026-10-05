import {
    barrierHeld,
    barrierOpen,
    fieldRewritten,
    fieldUnchanged,
    fieldUndeclared,
    itemAdded,
    itemFieldMissing,
    kindEcho,
    noOwnRecord,
    positionOnBoard,
    positionUnsigned,
    surfaceAbsent,
} from "coordination-surface/tools/core/strings/board.strings.ts";
import {
    barrierState,
    positionStructure,
    runField,
    runItem,
} from "coordination-surface/tools/core/runners/board.runner.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { SIGNED_LEAD } from "coordination-surface/tools/core/validators/venue.validator.ts";
import assert from "node:assert/strict";
import { surfacePath } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TARGET = "board.txt";

const RECORD = ["┌─── AGENT A", "Agent A — ACTIVE", "  Status:  working", "  Flags:   —", "└─── END AGENT A", ""].join(
    "\n",
);

const withRoot = function withRoot(check: (root: string, absolute: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-board-run-"));
    try {
        check(root, join(root, TARGET));
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

const writeTemplate = function writeTemplate(root: string): void {
    const template = resolve(root, surfacePath("venue_template"));
    mkdirSync(dirname(template), { recursive: true });
    writeVerbatim(template, ["A position carries these fields:", "Claim: what", "Evidence: where", ""].join("\n"));
};

describe("barrierState", () => {
    it("holds once every other seat is parked, and stays open before that", () => {
        assert.deepEqual(barrierState(3, 2), { code: 0, message: barrierHeld(2, 2) });
        assert.deepEqual(barrierState(3, 1), { code: 1, message: barrierOpen(1, 2) });
        assert.deepEqual(barrierState(0, 0), { code: 1, message: barrierOpen(0, -1) });
    });
});

describe("positionStructure", () => {
    it("names each position field a text carries once, and nothing without a venue template", () => {
        withRoot((root) => {
            assert.deepEqual(positionStructure(root, "Claim: x"), []);
            writeTemplate(root);
            assert.deepEqual(positionStructure(root, "Claim: x\n  Evidence: y\nClaim: z"), ["Claim", "Evidence"]);
        });
    });
});

describe("runItem", () => {
    it("posts an item under the seat's own item field, and refuses a missing surface, record or field, or a misplaced position", () => {
        withRoot((root, absolute) => {
            const request = {
                absolute,
                agent: "A",
                archive: join(root, "history.txt"),
                at: 5,
                kind: "artifact",
                repoRoot: root,
                siblings: [],
                target: TARGET,
                text: "take the index",
            };
            assert.equal(runItem(request).message, surfaceAbsent(TARGET));
            writeVerbatim(absolute, RECORD.replace("  Flags:   —\n", ""));
            assert.equal(runItem(request).message, itemFieldMissing("A", "Flags:", TARGET));
            assert.equal(runItem({ ...request, agent: "B" }).message, noOwnRecord("B"));
            writeVerbatim(absolute, RECORD);
            writeTemplate(root);
            assert.equal(
                runItem({ ...request, text: "Claim: x\nEvidence: y" }).message,
                positionOnBoard(["Claim", "Evidence"]),
            );
            const posted = runItem(request);
            assert.equal(posted.message, `${itemAdded("A-1", TARGET)}${kindEcho("artifact", false)}`);
            assert.ok(readFileSync(absolute, "utf8").includes("AGENT A-1"));
        });
    });

    it("refuses an unsigned position on a venue", () => {
        withRoot((root) => {
            const venue = "probe.blocking.md";
            const absolute = join(root, venue);
            writeVerbatim(absolute, RECORD.replace("  Flags:   —", "  Positions: —"));
            const request = {
                absolute,
                agent: "A",
                archive: "",
                at: 5,
                kind: "artifact",
                repoRoot: root,
                siblings: [],
                target: venue,
                text: "a claim",
            };
            assert.equal(runItem(request).message, positionUnsigned(SIGNED_LEAD));
        });
    });
});

describe("runField", () => {
    it("rewrites a field of the seat's own record once, and refuses a missing surface, record or field", () => {
        withRoot((_root, absolute) => {
            const request = { absolute, agent: "A", field: "Status", target: TARGET, text: "done" };
            assert.equal(runField(request).message, surfaceAbsent(TARGET));
            writeVerbatim(absolute, RECORD);
            assert.equal(runField({ ...request, agent: "B" }).message, noOwnRecord("B"));
            assert.equal(
                runField({ ...request, field: "Owns" }).message,
                fieldUndeclared("A", "Owns", TARGET, ["Status", "Flags"]),
            );
            assert.equal(runField(request).message, fieldRewritten("Status", "A", TARGET));
            assert.ok(readFileSync(absolute, "utf8").includes("  Status:  done"));
            assert.equal(runField(request).message, fieldUnchanged("Status", TARGET));
        });
    });
});
