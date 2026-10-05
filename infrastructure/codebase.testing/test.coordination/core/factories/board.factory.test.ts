import { describe, it } from "vitest";
import { BOARD_PATH } from "coordination-surface/tools/core/constants/board.constants.ts";
import assert from "node:assert/strict";
import { boardFinding } from "coordination-surface/tools/core/factories/board.factory.ts";

describe("boardFinding", () => {
    it("files a board defect against the board at the record's line and names its kind", () => {
        const finding = boardFinding("missingField", 12, "Agent A", "no Status", "a Status field", "add it");
        assert.equal(finding.rule, "board/missingField");
        assert.deepEqual([finding.path, finding.line, finding.locus], [BOARD_PATH, 12, "Agent A"]);
        assert.equal(finding.remediation.target, BOARD_PATH);
    });
});
