import assert from "node:assert/strict";
import { placedFileOf } from "@govlab/context/core/matchers/filename.matcher.ts";
import { test } from "vitest";

test("a placed file is one folder, a slash and a subject, an optional variant, a tag and an extension", () => {
    assert.deepEqual(placedFileOf("stores/cart.store.ts"), {
        extension: "ts",
        folder: "stores",
        subject: "cart",
        tag: "store",
        variant: null,
    });
    assert.equal(placedFileOf("stores/cart.lru.store.ts")?.variant, "lru");
});

test("a path that is not one folder over a subject, a tag and an extension is no placed file", () => {
    for (const path of [
        "cart.store.ts",
        "app/stores/cart.store.ts",
        "stores/cart.ts",
        "stores/store.store.ts",
        "stores/Cart.store.ts",
        "stores/-cart.store.ts",
    ]) {
        assert.equal(placedFileOf(path), null, path);
    }
});
