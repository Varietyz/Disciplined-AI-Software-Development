import {
    derivationSelfMapped,
    derivationUnknownRecord,
    derivationUnknownStage,
    derivationUnstaged,
    tierOf,
    unknownClosureId,
} from "@govlab/context/configuration/strings/algorithm.strings.ts";
import assert from "node:assert/strict";
import { severityOf } from "@govlab/context/configuration/strings/architecture.strings.ts";
import { test } from "vitest";

test("every algorithm message names the value it reports", () => {
    assert.ok(tierOf("pag").includes('"pag"'));
    assert.ok(derivationUnknownStage("ghost").includes('"ghost"'));
    assert.ok(derivationSelfMapped("verify").includes('"verify"'));
    assert.ok(derivationUnknownRecord("r").includes('"r"'));
    assert.ok(derivationUnstaged(["verify", "orient"]).endsWith("verify, orient"));
    assert.ok(unknownClosureId("c1").includes('"c1"'));
});

test("the architecture severity subject names the principle", () => {
    assert.ok(severityOf("Planted Rule").includes('"Planted Rule"'));
});
