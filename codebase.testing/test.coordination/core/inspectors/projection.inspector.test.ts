import {
    PROJECTION_CAP_CHARS,
    PROJECTION_DEFAULT,
    PROJECTION_MARKER,
} from "coordination-surface/tools/core/constants/board.constants.ts";
import { describe, it } from "vitest";
import type { Finding } from "coordination-surface/tools/core/types/segment.types.ts";
import assert from "node:assert/strict";
import { checkProjection } from "coordination-surface/tools/core/inspectors/projection.inspector.ts";

const VENUE = "venues/release.blocking.md";

const lociOf = function lociOf(findings: readonly Finding[]): string[] {
    return findings.map((finding) => finding.locus);
};

describe("checkProjection", () => {
    it("reports a projection that still reads as no board", () => {
        assert.deepEqual(lociOf(checkProjection(`${PROJECTION_MARKER} ${PROJECTION_DEFAULT}`, [])), [
            PROJECTION_MARKER,
        ]);
    });

    it("reports a projection line past its cap before judging what it says", () => {
        const long = `${PROJECTION_MARKER} ${"x".repeat(PROJECTION_CAP_CHARS)}`;
        assert.deepEqual(lociOf(checkProjection(long, [])), [PROJECTION_MARKER]);
    });

    it("reports a blocker the line names that is not on disk", () => {
        assert.deepEqual(lociOf(checkProjection(`${PROJECTION_MARKER} blocked on ghost.blocking.md`, [])), [
            "ghost.blocking.md",
        ]);
    });

    it("reports an open blocker the line omits", () => {
        assert.deepEqual(lociOf(checkProjection(`${PROJECTION_MARKER} clear`, [VENUE])), ["release.blocking.md"]);
    });

    it("reports nothing when the line names exactly the open blockers", () => {
        assert.deepEqual(checkProjection(`${PROJECTION_MARKER} blocked on release.blocking.md`, [VENUE]), []);
    });
});
