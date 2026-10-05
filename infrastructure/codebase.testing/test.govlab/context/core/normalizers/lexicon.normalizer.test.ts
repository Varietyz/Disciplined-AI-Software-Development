import assert from "node:assert/strict";
import { termNormalizer } from "@govlab/context/core/normalizers/lexicon.normalizer.ts";
import { test } from "vitest";

const RAW = { definition: "A planted term.", kind: "constraint", name: "Planted Term" };

test("a term takes its category's enforcer and shape, and the collection check merges under its own", () => {
    const normalize = termNormalizer({ population: "every term" });
    const term = normalize({ ...RAW }, "planted", null, { enforcedBy: ["a gate"], exampleShape: "placed-file" });
    assert.equal(term.id, "planted-term");
    assert.deepEqual(term.enforcedBy, ["a gate"]);
    assert.equal(term.exampleShape, "placed-file");
    assert.deepEqual(term.check, { population: "every term" });
});

test("a term refuses an undeclared example shape and a record missing its definition", () => {
    const normalize = termNormalizer(null);
    assert.throws(() => normalize({ ...RAW }, "planted", null, { exampleShape: "ghost" }));
    assert.throws(() => normalize({ kind: "constraint", name: "N" }, "planted", null, {}));
});
