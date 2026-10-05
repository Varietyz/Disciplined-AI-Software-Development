import { describe, it } from "vitest";
import {
    positionFieldLabels,
    positionsOutsideRecords,
    selfCorrections,
    venueFieldsFrom,
    venueSchemaGaps,
} from "coordination-surface/tools/core/validators/venue.validator.ts";
import assert from "node:assert/strict";

const RECORD_A = "Agent A — role";
const RECORD_CLOSE = "└───";

const TEMPLATE = ["```text", RECORD_A, "  Needs: what", "  Durable: where", RECORD_CLOSE, "```"].join("\n");

const item = function item(key: string, body: string): string[] {
    return [`┌─── AGENT ${key} at:1 to:*`, body, `└─── END AGENT ${key}`];
};

describe("venueSchemaGaps", () => {
    it("names a field the template does not declare and a declared field a record leaves out", () => {
        assert.deepEqual(venueFieldsFrom(TEMPLATE), ["Needs", "Durable"]);
        const source = [
            RECORD_A,
            "  Needs: x",
            "  Extra: y",
            "    deeper: ignored",
            RECORD_CLOSE,
            "Agent B — role",
            "  Needs: z",
            "  Durable: kept",
        ].join("\n");
        assert.deepEqual(
            venueSchemaGaps(source, TEMPLATE).map((gap) => [gap.record, gap.field, gap.state]),
            [
                [RECORD_A, "Extra", "undeclared"],
                [RECORD_A, "Durable", "absent"],
            ],
        );
        assert.deepEqual(venueSchemaGaps(source, "no records"), []);
    });
});

describe("positionFieldLabels", () => {
    it("reads the labels of the field block after its lead, past the signature line and up to the first blank", () => {
        const template = [
            "A position carries these fields:",
            "",
            "Signed: A",
            "Claim: text",
            "Evidence: path",
            "",
            "After: no",
        ].join("\n");
        assert.deepEqual(positionFieldLabels(template), ["Claim", "Evidence"]);
        assert.deepEqual(positionFieldLabels("no block"), []);
    });
});

describe("selfCorrections", () => {
    it("names an item whose contradiction clause cites its own seat's letter before the signature", () => {
        const source = [
            ...item("A-2", "Contradicts: A-1, the draft"),
            ...item("B-1", "Contradicts: A-1"),
            ...item("A-3", "Contradicts: nothing. Signed: A-3"),
        ].join("\n");
        assert.deepEqual(selfCorrections(source), ["A-2"]);
    });
});

describe("positionsOutsideRecords", () => {
    it("names a position opened outside every item and every fence", () => {
        const source = [
            "Position A-1 — stray",
            ...item("A-2", "Position A-2 — held"),
            "```",
            "Position A-3 — quoted",
            "```",
            "Position B-1",
        ].join("\n");
        assert.deepEqual(positionsOutsideRecords(source), [
            { key: "A-1", line: 1 },
            { key: "B-1", line: 8 },
        ]);
    });
});
