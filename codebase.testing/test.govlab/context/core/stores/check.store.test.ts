import { CheckTable } from "@govlab/context/core/stores/check.store.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("a record's own check merges over its kind's, and a value that is not a check is ignored", () => {
    const table = new CheckTable();
    table.forKind("technique", { authority: "the kind rule", population: "every technique" });
    table.forRecord("technique", "unit-testing", { population: "the one technique" });
    table.forRecord("technique", "ignored", "loose");
    assert.deepEqual(table.checkOf("technique", "unit-testing"), {
        authority: "the kind rule",
        population: "the one technique",
    });
    assert.deepEqual(table.checkOf("technique", "ignored"), {
        authority: "the kind rule",
        population: "every technique",
    });
    assert.equal(table.checkOf("lens", "any"), null);
});
