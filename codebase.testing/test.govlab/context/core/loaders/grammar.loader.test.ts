import { CheckTable } from "@govlab/context/core/stores/check.store.ts";
import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import assert from "node:assert/strict";
import { loadBundledData } from "@govlab/context/core/loaders/grammar.loader.ts";
import { test } from "vitest";

test("the bundled grammar loads its keywords, productions and templates, and every key is read", () => {
    const audit = new ReadAudit("pag");
    const data = loadBundledData(audit, new CheckTable());
    assert.ok(data.keywords.length > 0);
    assert.ok(data.productions.length > 0);
    assert.ok(data.templates.length > 0);
    assert.deepEqual(audit.unread(), []);
});
