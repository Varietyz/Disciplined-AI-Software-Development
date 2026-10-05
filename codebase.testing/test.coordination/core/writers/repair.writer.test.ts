import { containedBy, isEnumerable, writeRepair } from "coordination-surface/tools/core/writers/repair.writer.ts";
import { describe, it } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { outsideScope, unclaimedRegion } from "coordination-surface/tools/core/strings/repair.strings.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";

const REPAIRED = "docs/a.txt";

describe("containedBy and isEnumerable", () => {
    it("hold a path under a declared folder or the whole tree, and refuse the folder itself or a path beside it", () => {
        assert.equal(containedBy("", "any/path"), true);
        assert.equal(containedBy("whole", "any/path"), true);
        assert.equal(containedBy("docs", REPAIRED), true);
        assert.equal(containedBy("docs", "docs"), false);
        assert.equal(containedBy("docs", "other/a.txt"), false);
        assert.equal(isEnumerable("_generated/x.json", ["tools", "_generated"]), true);
        assert.equal(isEnumerable(REPAIRED, ["_generated"]), false);
    });
});

describe("writeRepair", () => {
    it("writes inside the declared scope, and refuses a path outside it or an enumerable region the run did not claim", () => {
        const repoRoot = mkdtempSync(join(tmpdir(), "coordination-repair-write-"));
        try {
            assert.deepEqual(writeRepair({ declared: "docs", repoRoot }, REPAIRED, "text"), {
                refusal: null,
                written: true,
            });
            assert.equal(existsSync(join(repoRoot, REPAIRED)), true);
            assert.deepEqual(writeRepair({ declared: "docs", repoRoot }, "other/a.txt", "text"), {
                refusal: outsideScope("other/a.txt", "docs"),
                written: false,
            });
            assert.deepEqual(writeRepair({ claimed: false, declared: "whole", repoRoot }, "_generated/x.txt", "text"), {
                refusal: unclaimedRegion("_generated/x.txt"),
                written: false,
            });
            assert.equal(existsSync(join(repoRoot, "_generated", "x.txt")), false);
        } finally {
            rmSync(repoRoot, { force: true, recursive: true });
        }
    });
});
