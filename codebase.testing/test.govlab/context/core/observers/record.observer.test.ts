import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import assert from "node:assert/strict";
import { createArchRelations } from "@govlab/context";
import { foldCategories } from "@govlab/context/core/loaders/ontology.loader.ts";
import { test } from "vitest";

const keysOf = (audit: ReadAudit): string[] =>
    audit.unread().map((entry) => `${entry.record} ${entry.key} ${entry.reason}`);

test("a key no normalizer reads is reported, at any depth, and a read key is not", () => {
    const audit = new ReadAudit("fixture");
    const tracked = audit.track({ id: "r1", kept: 1, nested: { read: 1, stray: 2 }, stray: 3 }, "file");
    assert.equal(tracked["kept"], 1);
    const { nested } = tracked;
    assert.ok(typeof nested === "object" && nested !== null && "read" in nested);
    assert.equal(Reflect.get(nested, "read"), 1);
    assert.deepEqual(keysOf(audit).toSorted(), [
        "file/r1 id unread",
        "file/r1 nested.stray unread",
        "file/r1 stray unread",
    ]);
});

test("an entry that is not a record, and a record a coercer rejects, are reported whole", () => {
    const audit = new ReadAudit("fixture");
    const records = audit.records([{ id: "ok" }, "loose", 7], "list");
    assert.equal(records.length, 1);
    audit.reject({ id: "bad" }, "list");
    assert.deepEqual(keysOf(audit), [
        "list#1 * not-a-record",
        "list#2 * not-a-record",
        "list/bad * rejected",
        "list/ok id unread",
    ]);
});

test("records handed on to their own tracking are counted once, under their own record", () => {
    const audit = new ReadAudit("fixture");
    const group = audit.track({ category: "c", copyright: "notice", records: [{ id: "a", name: "A" }] }, "categories");
    audit.attribution(group);
    for (const record of audit.records(group["records"], "c")) {
        assert.equal(record["id"], "a");
    }
    assert.equal(group["category"], "c");
    assert.deepEqual(keysOf(audit), ["c/a name unread"]);
    assert.deepEqual(audit.attributions(), ["notice"]);
});

test("a category fold reports the key its normalizer never reads", () => {
    const audit = new ReadAudit("fixture");
    const ids = foldCategories([{ category: "c", records: [{ id: "p", planted: true }] }], (raw) => raw["id"], audit);
    assert.deepEqual(ids, ["p"]);
    assert.deepEqual(keysOf(audit), ["c/p planted unread"]);
});

test("the bundled collections read every key their data carries", () => {
    assert.deepEqual(createArchRelations().unreadKeys(), []);
});
