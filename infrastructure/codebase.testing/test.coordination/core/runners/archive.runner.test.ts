import { ENTRY_LEADS, filedNotice } from "coordination-surface/tools/core/analyzers/archive.analyzer.ts";
import { afterAll, beforeAll, describe, it } from "vitest";
import {
    clauseExtended,
    clauseMissing,
    entryAdded,
    entryExists,
    entryNotFound,
    extendMissingHistory,
    extendNotFound,
    handledBy,
    historyMissing,
    leadUndeclared,
    leadsInPlace,
    leadsMissing,
    leadsRepaired,
    repairMissingHistory,
} from "coordination-surface/tools/core/strings/archive.strings.ts";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { runClosure, runEntry, runExtend, runRepair } from "coordination-surface/tools/core/runners/archive.runner.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const [POPULATION = "", BOUNDARY = ""] = ENTRY_LEADS;

const HEADING = "lost-update";

const HISTORY = ["# History", `### ${HEADING}`, `prose ${POPULATION} two seats`, ""].join("\n");

describe("the archive runners", () => {
    let root = "";
    let archive = "";
    let absent = "";

    beforeAll(() => {
        root = mkdtempSync(join(tmpdir(), "coordination-archive-"));
        archive = join(root, "history.txt");
        absent = join(root, "absent.txt");
        writeVerbatim(archive, HISTORY);
    });

    afterAll(() => {
        rmSync(root, { force: true, recursive: true });
    });

    it("runEntry refuses a missing history, a filed heading or a body without its leads, and files a complete entry", () => {
        const body = `${POPULATION} three seats\n${BOUNDARY} none`;
        assert.deepEqual(runEntry({ archive: absent, body, heading: "x" }), {
            code: 2,
            message: historyMissing(absent),
        });
        assert.deepEqual(runEntry({ archive, body, heading: HEADING }), {
            code: 2,
            message: `${entryExists(HEADING, archive)}${filedNotice(HISTORY)}`,
        });
        assert.deepEqual(runEntry({ archive, body: "prose", heading: "torn-write" }), {
            code: 2,
            message: leadsMissing([POPULATION, BOUNDARY]),
        });
        assert.deepEqual(runEntry({ archive, body, heading: "torn-write" }), {
            code: 0,
            message: `${entryAdded("torn-write", archive)}${filedNotice(HISTORY)}`,
        });
        assert.ok(readFileSync(archive, "utf8").includes("### torn-write"));
    });

    it("runRepair promotes the leads of the named entry once, and refuses a missing history or entry", () => {
        assert.deepEqual(runRepair({ archive: absent, heading: HEADING }), {
            code: 2,
            message: repairMissingHistory(absent),
        });
        assert.equal(
            runRepair({ archive, heading: "ghost" }).message.startsWith(entryNotFound("ghost", archive)),
            true,
        );
        assert.deepEqual(runRepair({ archive, heading: HEADING }), {
            code: 0,
            message: leadsRepaired([POPULATION], HEADING),
        });
        assert.deepEqual(runRepair({ archive, heading: HEADING }), { code: 0, message: leadsInPlace(HEADING) });
    });

    it("runExtend appends to a clause of an entry, and refuses a missing history, an undeclared lead, a missing entry or clause", () => {
        const request = { archive, body: "a third seat", heading: HEADING, lead: POPULATION };
        assert.deepEqual(runExtend({ ...request, archive: absent }), {
            code: 2,
            message: extendMissingHistory(absent),
        });
        assert.deepEqual(runExtend({ ...request, lead: "CAUSE:" }), {
            code: 2,
            message: leadUndeclared("CAUSE:", ENTRY_LEADS),
        });
        assert.equal(
            runExtend({ ...request, heading: "ghost" }).message.startsWith(extendNotFound("ghost", archive)),
            true,
        );
        assert.deepEqual(runExtend({ ...request, lead: BOUNDARY }), {
            code: 2,
            message: clauseMissing(HEADING, BOUNDARY),
        });
        assert.deepEqual(runExtend(request), { code: 0, message: clauseExtended(POPULATION, HEADING, archive) });
        assert.ok(readFileSync(archive, "utf8").includes(`${POPULATION} two seats\na third seat`));
    });

    it("runClosure names the item's author and the closing seat", () => {
        const board = join(root, "board.txt");
        writeVerbatim(board, ["┌─── AGENT A-1 at:1 to:B", "take the index", "└─── END AGENT A-1"].join("\n"));
        const closed = runClosure({
            absolute: board,
            agent: "B",
            archive: absent,
            closes: "A-1",
            index: absent,
            ref: null,
        });
        assert.deepEqual([closed.author, closed.label], ["A", handledBy("B")]);
    });
});
