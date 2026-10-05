import { afterAll, beforeAll, describe, it } from "vitest";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { projectRoot, surfacePath } from "coordination-surface/config/surface.config.ts";
import assert from "node:assert/strict";
import { fencedFlags } from "coordination-surface/tools/core/predicates/fence.predicate.ts";
import { runRecord } from "coordination-surface/tools/core/runners/record.runner.ts";
import { tmpdir } from "node:os";

const ROOT = projectRoot();
const TARGET = "collab.comms.active";

let scratch = "";

const boardIn = function boardIn(folder: string): string {
    const directory = join(scratch, folder);
    mkdirSync(directory);
    return join(directory, TARGET);
};

const raisedBoard = function raisedBoard(folder: string): string {
    const board = boardIn(folder);
    copyFileSync(resolve(ROOT, surfacePath("board_template")), board);
    return board;
};

const recordLines = function recordLines(source: string, agent: string): readonly number[] {
    return source
        .split("\n")
        .flatMap((line, index) =>
            line.includes(`AGENT ${agent} `) || line.includes(`Agent ${agent} `) ? [index] : [],
        );
};

describe("runRecord", () => {
    beforeAll(() => {
        scratch = mkdtempSync(join(tmpdir(), "coordination-record-"));
    });

    afterAll(() => {
        rmSync(scratch, { force: true, recursive: true });
    });

    it("adds two records to a board raised from the template, both outside its fenced specimens", () => {
        const board = raisedBoard("two");
        for (const agent of ["A", "B"]) {
            const outcome = runRecord({ absolute: board, agent, repoRoot: ROOT, target: TARGET });
            assert.equal(outcome.code, 0, outcome.message);
            assert.equal(outcome.raised, TARGET);
        }
        const source = readFileSync(board, "utf8");
        const fenced = fencedFlags(source);
        for (const agent of ["A", "B"]) {
            const lines = recordLines(source, agent);
            assert.ok(lines.length > 0, `record ${agent} was written`);
            assert.ok(
                lines.every((index) => fenced[index] !== true),
                `record ${agent} sits outside every fence`,
            );
        }
    });

    it("leaves the board unchanged when the seat already holds a record", () => {
        const board = raisedBoard("again");
        runRecord({ absolute: board, agent: "A", repoRoot: ROOT, target: TARGET });
        const held = readFileSync(board, "utf8");
        const again = runRecord({ absolute: board, agent: "A", repoRoot: ROOT, target: TARGET });
        assert.equal(again.code, 0);
        assert.equal(readFileSync(board, "utf8"), held);
    });

    it("refuses a board that does not exist", () => {
        const absent = boardIn("absent");
        const outcome = runRecord({ absolute: absent, agent: "A", repoRoot: ROOT, target: TARGET });
        assert.notEqual(outcome.code, 0);
        assert.equal(outcome.raised, null);
    });
});
