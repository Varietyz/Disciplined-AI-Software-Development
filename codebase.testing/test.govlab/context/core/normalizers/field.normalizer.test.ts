import {
    asClosed,
    asClosedArray,
    asDistinctFrom,
    asExemplar,
    asString,
    asStringArray,
    optionalString,
    optionalStrings,
} from "@govlab/context/core/normalizers/field.normalizer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const LEVELS = ["low", "high"] as const;
const SUBJECT = "a planted level";

test("asString and asStringArray keep only string values", () => {
    assert.equal(asString("held"), "held");
    assert.equal(asString(3), "");
    assert.deepEqual(asStringArray(["a", 1, "b"]), ["a", "b"]);
    assert.deepEqual(asStringArray("a"), []);
});

test("a closed value outside its vocabulary throws, naming the value and the vocabulary", () => {
    assert.equal(asClosed(LEVELS, "high", SUBJECT), "high");
    assert.throws(
        () => asClosed(LEVELS, "medium", SUBJECT),
        (error: unknown) =>
            error instanceof Error &&
            error.message.includes('declares "medium"') &&
            error.message.includes("low, high"),
    );
});

test("a closed array checks every entry and drops a value that is not a string", () => {
    assert.deepEqual(asClosedArray(LEVELS, ["low", "high", 3], SUBJECT), ["low", "high"]);
    assert.throws(() => asClosedArray(LEVELS, ["low", "ghost"], SUBJECT));
});

test("distinct declarations keep id and reason, and a value that is not a record is dropped", () => {
    assert.deepEqual(asDistinctFrom([{ id: "architecture:a", reason: "r" }, "loose", { id: 4 }]), [
        { id: "architecture:a", reason: "r" },
        { id: "", reason: "" },
    ]);
    assert.deepEqual(asDistinctFrom("not a list"), []);
});

test("asExemplar needs a before or an after, and defaults the medium to code", () => {
    assert.equal(asExemplar("loose"), null);
    assert.equal(asExemplar({ lang: "ts" }), null);
    const exemplar = asExemplar({ after: "b", before: "a" });
    assert.ok(exemplar);
    assert.equal(exemplar.medium, "code");
    assert.equal(exemplar.before, "a");
    assert.equal(asExemplar({ after: "b", medium: "composite" })?.medium, "composite");
});

test("optionalString and optionalStrings add the key only when it carries a value", () => {
    assert.deepEqual(optionalString({ note: "n" }, "note"), { note: "n" });
    assert.deepEqual(optionalString({ note: "" }, "note"), {});
    assert.deepEqual(optionalStrings({ tags: ["t"] }, "tags"), { tags: ["t"] });
    assert.deepEqual(optionalStrings({ tags: [] }, "tags"), {});
});
