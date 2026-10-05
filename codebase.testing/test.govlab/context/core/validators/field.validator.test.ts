import {
    danglingFields,
    emptyFields,
    recordDefects,
    refuseRecord,
} from "@govlab/context/core/validators/field.validator.ts";
import assert from "node:assert/strict";
import { bundledReason } from "./ontology.fixture.ts";
import { schemaOf } from "@govlab/context/core/selectors/reason.selector.ts";
import { test } from "vitest";

const SCHEMA = {
    id: { required: true, type: "label" },
    nested: { required: false, type: "object" },
    "nested.note": { required: false, type: "text" },
    parts: { required: true, target: "reasoning:part", type: "refs" },
    size: { required: false, type: "flag" },
    text: { required: true, type: "text" },
} as const;

const CLEAN = { id: "a-record", parts: ["p1"], text: "a statement" };

test("recordDefects passes a clean record and names each missing, mistyped or ill-formed field", () => {
    assert.deepEqual(recordDefects(SCHEMA, CLEAN), []);
    assert.deepEqual(recordDefects(SCHEMA, { id: "a-record", parts: ["p1", 2], size: "big" }), [
        "has parts set to something other than a list of record ids",
        "has size set to something other than true or false",
        "has no text, which its kind requires",
    ]);
    assert.deepEqual(recordDefects(SCHEMA, { ...CLEAN, id: "A_Record" }), [
        'has the id "A_Record", which is not kebab-case',
    ]);
    assert.deepEqual(recordDefects(SCHEMA, { ...CLEAN, nested: { note: 3 } }), [
        "has nested.note set to something other than a string",
    ]);
});

test("recordDefects leaves a present but blank required value to emptyFields", () => {
    const blank = { ...CLEAN, parts: [], text: "  " };
    assert.deepEqual(recordDefects(SCHEMA, blank), []);
    assert.deepEqual(emptyFields(SCHEMA, blank), ["parts", "text"]);
});

test("emptyFields accepts none with a reason and refuses a bare none", () => {
    assert.deepEqual(emptyFields(SCHEMA, { ...CLEAN, text: "none: nothing enforces it yet" }), []);
    assert.deepEqual(emptyFields(SCHEMA, { ...CLEAN, text: "none" }), ["text"]);
});

test("refuseRecord throws with the subject, kind, id and every defect", () => {
    assert.doesNotThrow(() => {
        refuseRecord("probe", "sample", SCHEMA, CLEAN);
    });
    assert.throws(
        () => {
            refuseRecord("probe", "sample", SCHEMA, { id: "a-record", parts: [] });
        },
        { message: 'probe: the sample "a-record" has no text, which its kind requires' },
    );
});

test("a bundled technique with no fails field is refused at load", () => {
    const [technique] = bundledReason().techniques;
    assert.ok(technique, "the bundled reasoning data holds a technique");
    const failless = Object.fromEntries(Object.entries(technique).filter(([key]) => key !== "fails"));
    assert.throws(
        () => {
            refuseRecord("reason", "technique", schemaOf("technique"), failless);
        },
        { message: `reason: the technique "${technique.id}" has no fails, which its kind requires` },
    );
});

const members = (target: string): ReadonlySet<string> | undefined =>
    target === "reasoning:part" ? new Set(["p1"]) : undefined;

test("danglingFields reports each value its target kind does not hold, and skips an unknown target", () => {
    const records = [
        { id: "kept", parts: ["p1"] },
        { id: "lost", parts: ["p1", "p9"] },
    ];
    assert.deepEqual(danglingFields("sample", SCHEMA, records, members), [
        { field: "parts", id: "lost", kind: "sample", target: "reasoning:part", value: "p9" },
    ]);
    assert.deepEqual(
        danglingFields("sample", SCHEMA, records, () => {}),
        [],
    );
});
