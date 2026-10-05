import {
    CHECK_ABSORPTION,
    absorptionDuplicated,
    absorptionHolds,
    absorptionNoCloses,
    absorptionOpen,
    absorptionUndistributed,
} from "coordination-surface/tools/core/strings/converge.strings.ts";
import {
    CLOSES_FIELD,
    DISTRIBUTES_FIELD,
    absorptionEdge,
    absorptionState,
    declaredDistributions,
    hasReadMark,
} from "coordination-surface/tools/core/resolvers/converge.resolver.ts";
import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { AWAITING_MARKER } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import assert from "node:assert/strict";
import { surfacePath } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const VENUE = "venue-a";

const withPlanning = function withPlanning(
    files: Readonly<Record<string, string>>,
    check: (root: string) => void,
): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-absorption-"));
    try {
        const planning = resolve(root, surfacePath("planning"));
        mkdirSync(planning, { recursive: true });
        for (const [name, text] of Object.entries(files)) {
            writeVerbatim(join(planning, name), text);
        }
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("absorptionState and absorptionEdge", () => {
    it("hold when one checklist distributes the venue, closes on a row, and has nothing else open", () => {
        const plan = [
            `${DISTRIBUTES_FIELD} ${VENUE}`,
            `${CLOSES_FIELD} 2.1.1`,
            "- [ ] 2.1.1 close",
            "- [x] 1.1.1 done",
        ];
        withPlanning({ "plan.md": plan.join("\n") }, (root) => {
            assert.deepEqual(absorptionState(root, VENUE), {
                checklist: "plan.md",
                closes: "2.1.1",
                declaring: ["plan.md"],
                open: [],
            });
            assert.deepEqual(absorptionEdge(root, `venues/${VENUE}`), {
                detail: absorptionHolds("plan.md", "2.1.1"),
                edge: CHECK_ABSORPTION,
                holds: true,
                step: "absorption",
            });
        });
    });

    it("do not hold with an open row, no closure row, two declaring checklists or none", () => {
        const opened = [`${DISTRIBUTES_FIELD} ${VENUE}`, `${CLOSES_FIELD} 2.1.1`, "- [ ] 1.1.1 open"].join("\n");
        withPlanning({ "plan.md": opened }, (root) => {
            assert.equal(absorptionEdge(root, VENUE).detail, absorptionOpen("plan.md", ["1.1.1"]));
        });
        withPlanning({ "plan.md": `${DISTRIBUTES_FIELD} ${VENUE}` }, (root) => {
            assert.equal(absorptionEdge(root, VENUE).detail, absorptionNoCloses("plan.md", CLOSES_FIELD));
        });
        const declares = `${DISTRIBUTES_FIELD} ${VENUE}`;
        withPlanning({ "a.md": declares, "b.md": declares }, (root) => {
            assert.equal(absorptionEdge(root, VENUE).detail, absorptionDuplicated(["a.md", "b.md"]));
        });
        withPlanning({}, (root) => {
            assert.equal(absorptionEdge(root, VENUE).detail, absorptionUndistributed(VENUE, DISTRIBUTES_FIELD));
            assert.equal(absorptionEdge(root, VENUE).holds, false);
        });
        const empty = mkdtempSync(join(tmpdir(), "coordination-absorption-"));
        assert.equal(absorptionState(empty, VENUE), null);
        rmSync(empty, { force: true, recursive: true });
    });
});

describe("declaredDistributions and hasReadMark", () => {
    it("list each venue a surface distributes, skipping placeholders, and see a read mark beyond the absent one", () => {
        const texts: Record<string, string> = {
            "a.md": `x\n${DISTRIBUTES_FIELD} venue-a\n${DISTRIBUTES_FIELD} <venue>`,
            "b.md": "nothing",
        };
        assert.deepEqual(
            declaredDistributions(["a.md", "b.md"], (path) => texts[path] ?? ""),
            [{ declares: "venue-a", line: 2, path: "a.md" }],
        );
        assert.equal(hasReadMark(`${AWAITING_MARKER} A`), true);
        assert.equal(hasReadMark(`${AWAITING_MARKER} —`), false);
        assert.equal(hasReadMark("no roster"), false);
    });
});
