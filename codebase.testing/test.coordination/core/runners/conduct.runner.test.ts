import { describe, it } from "vitest";
import {
    halfStated,
    rosterMissing,
    rowMalformed,
    rowMissing,
    undeclaredHalf,
} from "coordination-surface/tools/core/strings/conduct.strings.ts";
import { isDeclaredHalf, runHalf, withThirdCell } from "coordination-surface/tools/core/runners/conduct.runner.ts";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { FAILING_QUESTIONS } from "coordination-surface/tools/core/constants/conduct.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const ROSTER = "roster.md";
const ROW = "| `one-writer` | who writes | none | why |";

describe("isDeclaredHalf and withThirdCell", () => {
    it("accept the unbuilt mark, the absent mark, a failing question or a registered gate, and rewrite a row's third cell", () => {
        assert.equal(isDeclaredHalf("none", []), true);
        assert.equal(isDeclaredHalf("—", []), true);
        assert.equal(isDeclaredHalf(FAILING_QUESTIONS[0] ?? "", []), true);
        assert.equal(isDeclaredHalf("board", ["board"]), true);
        assert.equal(isDeclaredHalf("invented", ["board"]), false);
        assert.equal(withThirdCell(ROW, "board"), "| `one-writer` | who writes | `board` | why |");
        assert.equal(withThirdCell("| `short` | x |", "board"), null);
    });
});

describe("runHalf", () => {
    it("states a row's observing half, and refuses a missing roster, an undeclared value, a missing or malformed row", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-half-"));
        try {
            const request = { registered: ["board"], repoRoot, slug: "one-writer", target: ROSTER, value: "board" };
            assert.deepEqual(runHalf(request), { code: 2, message: rosterMissing(ROSTER) });
            writeVerbatim(join(repoRoot, ROSTER), [ROW, "| `short` | x |"].join("\n"));
            assert.deepEqual(runHalf({ ...request, value: "invented" }), {
                code: 2,
                message: undeclaredHalf("invented", FAILING_QUESTIONS),
            });
            assert.deepEqual(runHalf({ ...request, slug: "ghost" }), { code: 2, message: rowMissing("ghost", ROSTER) });
            assert.deepEqual(runHalf({ ...request, slug: "short" }), { code: 2, message: rowMalformed("short") });
            assert.deepEqual(runHalf(request), { code: 0, message: halfStated("one-writer", "board") });
            assert.ok(readFileSync(join(repoRoot, ROSTER), "utf8").includes("| `board` |"));
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
