import {
    exampleFolderMismatch,
    exampleShapeOf,
    exampleTagMismatch,
    misplacedExample,
    renameFromDeclaredTag,
    renameUncovered,
    undeclaredPlacement,
    undeclaredRefusal,
} from "@govlab/context/configuration/strings/lexicon.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("every lexicon example defect names the path, the tag or the folder it compares", () => {
    assert.ok(exampleShapeOf("planted").endsWith("planted"));
    assert.ok(misplacedExample("heap.ts").includes('"heap.ts"'));
    assert.ok(exampleTagMismatch("store", "queue").includes('"store"'));
    assert.ok(exampleFolderMismatch("clocks", "timers").includes('"timers"'));
    assert.ok(renameFromDeclaredTag("store").includes('"store"'));
    assert.ok(renameUncovered("caches", "store").includes("caches/…store"));
    assert.ok(undeclaredPlacement("placed-file").includes('"placed-file"'));
    assert.ok(undeclaredRefusal("renamed-file").includes('"renamed-file"'));
});
