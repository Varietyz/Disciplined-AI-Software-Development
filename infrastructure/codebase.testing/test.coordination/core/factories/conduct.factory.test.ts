import { describe, it } from "vitest";
import { unresolvedFinding, unstatedFinding } from "coordination-surface/tools/core/factories/conduct.factory.ts";
import { ROSTER } from "coordination-surface/tools/core/constants/conduct.constants.ts";
import assert from "node:assert/strict";

const ROW = { cell: "board/ghost", cells: 3, line: 9, slug: "no-silent-drop" };

describe("conduct findings", () => {
    it("file an unstated third cell and an observer nothing registers against the roster row", () => {
        const unstated = unstatedFinding(ROW);
        assert.equal(unstated.rule, "conduct/unstatedHalf");
        assert.deepEqual([unstated.path, unstated.line, unstated.locus], [ROSTER, 9, "no-silent-drop"]);

        const unresolved = unresolvedFinding(ROW);
        assert.equal(unresolved.rule, "conduct/unresolvedObserver");
        assert.ok(unresolved.actual.includes("board/ghost"));
        assert.equal(unresolved.remediation.from, "board/ghost");
    });
});
