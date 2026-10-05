import assert from "node:assert/strict";
import { deepFreeze } from "@govlab/context/core/converters/base.converter.ts";
import { test } from "vitest";

test("deepFreeze freezes a value and every object under it, and passes a primitive through", () => {
    const frozen = deepFreeze({ list: [{ id: "a" }], nested: { note: "n" } });
    assert.equal(Object.isFrozen(frozen), true);
    assert.equal(Object.isFrozen(frozen.nested), true);
    assert.equal(Object.isFrozen(frozen.list[0]), true);
    assert.equal(deepFreeze(3), 3);
    assert.equal(deepFreeze(null), null);
});
