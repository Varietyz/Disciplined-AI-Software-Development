import {
    checkDelimiters,
    checkItemFences,
    checkItemLetters,
} from "coordination-surface/tools/core/inspectors/fence.inspector.ts";
import { describe, it } from "vitest";
import type { Finding } from "coordination-surface/tools/core/types/segment.types.ts";
import assert from "node:assert/strict";

const BOARD = [
    "Agent A — ACTIVE",
    "┌─── AGENT A",
    "┌─── AGENT B-1 at:5 to:A",
    "a peer's item inside A's record",
    "└─── END AGENT B-1",
    "┌─── AGENT A-2",
    "└─── END AGENT A-2",
    "└─── END AGENT A",
    "┌─── AGENT A-3 at:9",
].join("\n");

type BoardRecord = Parameters<typeof checkDelimiters>[1][number];

const record = function record(kind: BoardRecord["kind"], label: string, line: number): BoardRecord {
    return { fields: new Map<string, string>(), kind, label, line, state: "ACTIVE" };
};

const lociOf = function lociOf(findings: readonly Finding[]): string[] {
    return findings.map((finding) => finding.locus);
};

describe("checkItemLetters", () => {
    it("reports an item sitting inside a record its key letter does not name", () => {
        assert.deepEqual(lociOf(checkItemLetters(BOARD)), ["B-1"]);
    });
});

describe("checkItemFences", () => {
    it("reports an item opened without a stamp and an item missing its close", () => {
        assert.deepEqual(lociOf(checkItemFences(BOARD)), ["A-2", "A-3"]);
    });
});

describe("checkDelimiters", () => {
    it("reports a record another seat's fence sits inside, and a record with no fence of its own", () => {
        const source = [
            "┌─── AGENT A",
            "Agent A — ACTIVE",
            "┌─── AGENT B",
            "└─── END AGENT B",
            "└─── END AGENT A",
            "Agent C — ACTIVE",
            "Gate g — PASS",
        ].join("\n");
        const findings = checkDelimiters(source, [
            record("agent", "Agent A", 2),
            record("agent", "Agent C", 6),
            record("gate", "Gate g", 7),
        ]);
        assert.deepEqual(
            findings.map((finding) => [finding.locus, finding.line]),
            [
                ["Agent A", 3],
                ["Agent C", 6],
            ],
        );
    });
});
