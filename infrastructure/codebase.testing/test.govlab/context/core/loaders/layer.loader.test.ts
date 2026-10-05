import { INDEX_FILE, MEMBERSHIP_KEY } from "@govlab/context/configuration/constants/layer.constants.ts";
import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import { asLayerMembership } from "@govlab/context/core/normalizers/layer.normalizer.ts";
import assert from "node:assert/strict";
import { readLayerList } from "@govlab/context/core/loaders/layer.loader.ts";
import { test } from "vitest";

test("readLayerList coerces each entry under the key and rejects the ones the coercer refuses", () => {
    const audit = new ReadAudit("layers");
    const membership = readLayerList(audit, INDEX_FILE, MEMBERSHIP_KEY, asLayerMembership);
    assert.ok(membership.length > 0);
    const refused = new ReadAudit("layers");
    assert.deepEqual(
        readLayerList(refused, INDEX_FILE, MEMBERSHIP_KEY, () => null),
        [],
    );
    assert.ok(refused.unread().some((entry) => entry.reason === "rejected"));
});
