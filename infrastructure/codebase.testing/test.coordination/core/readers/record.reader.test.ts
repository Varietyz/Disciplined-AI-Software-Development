import { citedIds, readRecordDocument } from "coordination-surface/tools/core/readers/record.reader.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const SOURCE = [
    "---",
    "records: keyed",
    "---",
    "# Records",
    "### AB-01",
    "owner: A",
    "not a key: skipped",
    "owner: B",
    "### AB-02",
    "state: open",
    "## Next section",
    "stray: ignored",
].join("\n");

describe("readRecordDocument", () => {
    it("reads the declared shape and each record's keys, closing a record at the next heading", () => {
        assert.deepEqual(readRecordDocument(SOURCE), {
            records: [
                { id: "AB-01", keys: { owner: "B" }, line: 5 },
                { id: "AB-02", keys: { state: "open" }, line: 9 },
            ],
            shape: "keyed",
        });
    });

    it("defaults to typed records", () => {
        assert.equal(readRecordDocument("### X").shape, "typed");
    });
});

describe("citedIds", () => {
    it("reads each identifier with two capitals and two digits once", () => {
        assert.deepEqual(citedIds("see AB-12, AB-12 and A-1, abc-12, ZZ-99"), ["AB-12", "ZZ-99"]);
    });
});
