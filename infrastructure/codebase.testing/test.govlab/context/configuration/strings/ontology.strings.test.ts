import {
    collectionCycle,
    debugLine,
    duplicateCollection,
    duplicateRecordId,
    emptyRecordId,
    missingDependency,
    unbuiltCollection,
    unregisteredCollection,
} from "@govlab/context/configuration/strings/ontology.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("a debug line carries the package namespace ahead of the message", () => {
    assert.equal(debugLine("loaded"), "[govlab:context] loaded");
});

test("every collection message names the collection or the record it reports", () => {
    assert.ok(duplicateRecordId("lexicon", "a").includes('"a"'));
    assert.ok(emptyRecordId("lexicon").startsWith("lexicon:"));
    assert.ok(duplicateCollection("pag").includes('"pag"'));
    assert.ok(collectionCycle("pag").includes('"pag"'));
    assert.ok(unregisteredCollection("pag").includes('"pag"'));
    assert.ok(unbuiltCollection("pag").includes('"pag"'));
    assert.equal(missingDependency("layers", "lexicon"), "layers collection requires the lexicon collection");
});
