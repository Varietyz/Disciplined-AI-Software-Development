import {
    admissibleInvariants,
    agendaInvariants,
    agendaOrdinalOf,
    agendaRows,
    disorderedRows,
    nextUnraised,
    ordinalValue,
    plannedInvariants,
} from "coordination-surface/tools/core/readers/agenda.reader.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const AGENDA = [
    "| planned | invariant | what it must establish | state |",
    "|---|---|---|---|",
    "| 1 | `one-writer` | x | planned |",
    "| 2 | `lock` | x | `open` — held |",
    "| 1b | `early` | x | planned |",
    "| 3 | `later` | x | `planned` — noted |",
    "| 3 | `one-writer` | x | planned |",
].join("\n");

describe("agendaRows", () => {
    it("reads each named invariant once with its ordinal and whether it is still planned", () => {
        assert.deepEqual(agendaRows(AGENDA), [
            { invariant: "one-writer", ordinal: "1", planned: true },
            { invariant: "lock", ordinal: "2", planned: false },
            { invariant: "early", ordinal: "1b", planned: true },
            { invariant: "later", ordinal: "3", planned: true },
        ]);
        assert.deepEqual(agendaInvariants(AGENDA), ["one-writer", "lock", "early", "later"]);
        assert.deepEqual(plannedInvariants(AGENDA), ["one-writer", "early", "later"]);
        assert.equal(agendaOrdinalOf(AGENDA, "early"), "1b");
        assert.equal(agendaOrdinalOf(AGENDA, "absent"), "");
    });
});

describe("ordinalValue and disorderedRows", () => {
    it("order ordinals by number then letter suffix, and name a row written after a later one", () => {
        assert.equal(ordinalValue("2"), 2);
        assert.ok((ordinalValue("1b") ?? 0) > (ordinalValue("1a") ?? 0));
        assert.ok((ordinalValue("1z") ?? 0) < 2);
        assert.equal(ordinalValue("b1"), null);
        assert.equal(ordinalValue("1B"), null);
        assert.deepEqual(disorderedRows(AGENDA), [{ after: "lock", invariant: "early", ordinal: "1b" }]);
    });
});

describe("admissibleInvariants and nextUnraised", () => {
    it("offer the planned invariants no venue raises yet, first one first", () => {
        const venues = [`venues/one-writer.1.blocking.md`];
        assert.deepEqual(admissibleInvariants(AGENDA, venues), ["early", "later"]);
        assert.equal(nextUnraised(AGENDA, venues), "early");
        assert.equal(nextUnraised("", venues), null);
    });
});
