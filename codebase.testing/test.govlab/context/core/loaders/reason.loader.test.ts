import { CheckTable } from "@govlab/context/core/stores/check.store.ts";
import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import assert from "node:assert/strict";
import { loadBundledData } from "@govlab/context/core/loaders/reason.loader.ts";
import { test } from "vitest";

test("the bundled reasoning collection loads its nodes and loop, and every key is read", () => {
    const audit = new ReadAudit("reasoning");
    const data = loadBundledData(audit, new CheckTable());
    assert.ok(data.nodes.length > 0);
    assert.ok(data.derivationLoop.stages.length > 0);
    assert.deepEqual(audit.unread(), []);
});
