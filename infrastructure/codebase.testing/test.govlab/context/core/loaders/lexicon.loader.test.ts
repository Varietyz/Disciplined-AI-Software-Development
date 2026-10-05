import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import assert from "node:assert/strict";
import { loadTerms } from "@govlab/context/core/loaders/lexicon.loader.ts";
import { test } from "vitest";

test("the bundled terms load, leaving the collection check file out, and every key is read", () => {
    const audit = new ReadAudit("lexicon");
    assert.ok(loadTerms(audit).length > 0);
    assert.deepEqual(audit.unread(), []);
});

test("planted categories load in place of the bundled data", () => {
    const terms = loadTerms(new ReadAudit("lexicon"), [
        { category: "planted", records: [{ definition: "A planted term.", kind: "constraint", name: "Planted Term" }] },
    ]);
    assert.deepEqual(
        terms.map((term) => term.id),
        ["planted-term"],
    );
});
