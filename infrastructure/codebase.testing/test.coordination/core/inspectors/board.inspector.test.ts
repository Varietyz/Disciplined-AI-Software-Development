import {
    checkDuplicateFields,
    checkIndex,
    checkItemAddressing,
    checkMarkers,
    checkReadable,
    checkTemplateDrift,
    letterOfLabel,
    readerSet,
} from "coordination-surface/tools/core/inspectors/board.inspector.ts";
import { describe, it } from "vitest";
import type { Finding } from "coordination-surface/tools/core/types/segment.types.ts";
import { READ_BUDGET_CHARS } from "coordination-surface/tools/core/constants/board.constants.ts";
import assert from "node:assert/strict";

const lociOf = function lociOf(findings: readonly Finding[]): string[] {
    return findings.map((finding) => finding.locus);
};

describe("readerSet", () => {
    it("reads the named letters of an addressed line and nothing for a broadcast or role address", () => {
        assert.deepEqual(readerSet("To B, C — read the draft"), ["B", "C"]);
        assert.deepEqual(readerSet("To ALL — everyone"), []);
        assert.deepEqual(readerSet("To WHOEVER holds review — take it"), []);
        assert.deepEqual(readerSet("To B without a terminator"), []);
        assert.deepEqual(readerSet("plain prose"), []);
    });
});

describe("letterOfLabel", () => {
    it("reads the letter after a record's kind word, or keeps a bare label", () => {
        assert.equal(letterOfLabel("Agent B"), "B");
        assert.equal(letterOfLabel("B"), "B");
    });
});

describe("checkIndex", () => {
    it("reports a letter bound twice and an agent writing under an unbound letter", () => {
        const index = "| A | governance | ACTIVE |\n| A | document | ACTIVE |";
        const records = [
            { kind: "agent", label: "Agent A", line: 1 },
            { kind: "agent", label: "Agent B", line: 3 },
            { kind: "gate", label: "Gate converge", line: 5 },
        ];
        assert.deepEqual(lociOf(checkIndex(records, index)), ["A", "B"]);
    });
});

describe("checkTemplateDrift", () => {
    it("reports a record kind whose template fields differ from the schema, and nothing when they agree", () => {
        const gate = "Gate <id> — <state>\n  State: <v>\n  Owner: <v>\n  Blocker: <v>";
        const drifted = `Agent <letter> — <ACTIVE>\n  Owns: <v>\n  Status: <v>\n\n${gate}`;
        const agreed = `Agent <letter> — <ACTIVE>\n  Owns: <v>\n  Status: <v>\n  Flags: —\n  Refs: —\n\n${gate}`;
        assert.deepEqual(lociOf(checkTemplateDrift(drifted)), ["agent"]);
        assert.deepEqual(checkTemplateDrift(agreed), []);
    });
});

describe("checkReadable", () => {
    it("reports a line past the read budget at its own line number", () => {
        const long = "x".repeat(READ_BUDGET_CHARS + 1);
        const findings = checkReadable(`short\n${long}`);
        assert.deepEqual(
            findings.map((finding) => finding.line),
            [2],
        );
        assert.deepEqual(checkReadable("short"), []);
    });
});

describe("checkItemAddressing", () => {
    it("reports an item whose text names an addressee while its metadata broadcasts", () => {
        assert.deepEqual(lociOf(checkItemAddressing("meta to:*\nTo B — only one reader")), ["To B — only one reader"]);
    });
});

describe("checkDuplicateFields", () => {
    it("reports a schema field a record declares twice, reading each record up to the next", () => {
        const source = [
            "Agent A — ACTIVE",
            "  Owns: x",
            "  Owns: y",
            "  Status: z",
            "Gate g — PASS",
            "  State: PASS",
        ].join("\n");
        const records = [
            { fields: new Map(), kind: "agent", label: "Agent A", line: 1, state: "ACTIVE" },
            { fields: new Map(), kind: "gate", label: "Gate g", line: 5, state: "PASS" },
        ] as const;
        const findings = checkDuplicateFields(source, records);
        assert.deepEqual(lociOf(findings), ["Agent A"]);
        assert.equal(findings[0]?.actual.includes("Owns"), true);
    });
});

describe("checkMarkers", () => {
    it("reports a field whose value opens with a stale marker, and passes the word later in the value", () => {
        const findings = checkMarkers(["  Status: DONE", "  Status: working, DONE later", "  Flags: none"].join("\n"));
        assert.deepEqual(
            findings.map((finding) => [finding.locus, finding.line]),
            [["DONE", 1]],
        );
    });
});
