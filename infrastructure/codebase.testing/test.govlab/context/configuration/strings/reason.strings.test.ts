import {
    evidenceSourceOf,
    predicateTypeOf,
    undeclaredModel,
    undeclaredReasonKind,
    verdictOf,
} from "@govlab/context/configuration/strings/reason.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("every reasoning subject names the kind, the model or the surface it reads", () => {
    assert.ok(undeclaredReasonKind("ghost").includes('"ghost"'));
    assert.ok(predicateTypeOf("s-sem").includes('"s-sem"'));
    assert.ok(evidenceSourceOf("s-sem").includes('"s-sem"'));
    assert.ok(verdictOf("s-sem").includes('"s-sem"'));
    assert.ok(undeclaredModel("epistemology").includes('"epistemology"'));
});
