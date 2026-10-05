import {
    ENTRY_LEADS,
    clauseEnd,
    declaresLead,
    entryEnd,
    filedHeadings,
    filedNotice,
    promoteLeads,
} from "coordination-surface/tools/core/analyzers/archive.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { classesFiled } from "coordination-surface/tools/core/strings/archive.strings.ts";

const [POPULATION = "", BOUNDARY = ""] = ENTRY_LEADS;

const ARCHIVE = [
    "# History",
    "### lost-update",
    `${POPULATION} two seats`,
    "a second line",
    "",
    "trailing prose",
    "### A one-off episode",
    `${BOUNDARY} none`,
    "### ",
].join("\n");

describe("filedHeadings and filedNotice", () => {
    it("lists every non-empty entry heading, and names how many are classes and how many are not", () => {
        assert.deepEqual(filedHeadings(ARCHIVE), ["lost-update", "A one-off episode"]);
        assert.equal(filedNotice(ARCHIVE), classesFiled(["lost-update"], 1));
        assert.equal(filedNotice("# nothing filed"), "");
    });
});

describe("declaresLead", () => {
    it("answers whether any line of a body opens with the lead", () => {
        assert.equal(declaresLead(`x\n${POPULATION} y`, POPULATION), true);
        assert.equal(declaresLead(`x ${POPULATION} y`, POPULATION), false);
    });
});

describe("entryEnd and clauseEnd", () => {
    it("bound an entry at the next heading, and a clause at the first blank line inside its entry", () => {
        const lines = ARCHIVE.split("\n");
        assert.equal(entryEnd(lines, 1), 6);
        assert.equal(entryEnd(lines, 8), lines.length);
        assert.equal(clauseEnd(lines, 1, POPULATION), 3);
        assert.equal(clauseEnd(lines, 6, BOUNDARY), 7);
        assert.equal(clauseEnd(lines, 1, BOUNDARY), -1);
    });
});

describe("promoteLeads", () => {
    it("moves each lead written mid-line onto a line of its own, and leaves a line that opens with one alone", () => {
        assert.deepEqual(promoteLeads(`prose ${POPULATION} two ${BOUNDARY} none`), {
            lines: ["prose", `${POPULATION} two`, `${BOUNDARY} none`],
            promoted: [POPULATION, BOUNDARY],
        });
        assert.deepEqual(promoteLeads(`${POPULATION} two`), { lines: [`${POPULATION} two`], promoted: [] });
    });
});
