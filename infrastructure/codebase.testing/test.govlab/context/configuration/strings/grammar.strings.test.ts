import {
    enumViolation,
    missingRequiredSlot,
    undeclaredPagKind,
    unknownTemplateType,
} from "@govlab/context/configuration/strings/grammar.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("every grammar message names the kind, the id or the slot it reports", () => {
    assert.ok(undeclaredPagKind("ghost").includes('"ghost"'));
    assert.equal(missingRequiredSlot("kind"), "missing_required_slot:kind");
    assert.equal(enumViolation("mode"), "enum_violation:mode");
    assert.equal(unknownTemplateType("GHOST"), "unknown_template_type:GHOST");
});
