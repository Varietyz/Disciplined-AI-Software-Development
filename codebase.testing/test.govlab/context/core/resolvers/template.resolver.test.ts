import { resolvePagTemplate, slotIsDangling } from "@govlab/context/core/resolvers/template.resolver.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const slot = (
    name: string,
    extra: object = {},
): { description: string; kind: string; name: string; required: boolean } => ({
    description: name,
    kind: "text",
    name,
    required: true,
    ...extra,
});

const TEMPLATE = {
    body: "THIS {kind} runs {mode}",
    constraints: [],
    slots: [slot("kind"), slot("mode", { enum: ["fast", "slow"] }), slot("absent", { required: false })],
    title: "t",
    type: "KNOWN",
};

test("resolvePagTemplate fills every supplied slot and reports the ones left open", () => {
    const resolved = resolvePagTemplate(TEMPLATE, { kind: "TASK", mode: "fast" });
    assert.equal(resolved.text, "THIS TASK runs fast");
    assert.deepEqual(resolved.unresolved, []);
    assert.deepEqual(resolved.violations, []);
    const open = resolvePagTemplate(TEMPLATE, { mode: "fast" });
    assert.deepEqual(open.unresolved, ["kind"]);
    assert.equal(open.violations.length, 1);
});

test("resolvePagTemplate reports a value outside a slot's closed set", () => {
    assert.equal(resolvePagTemplate(TEMPLATE, { kind: "TASK", mode: "sideways" }).violations.length, 1);
});

test("slotIsDangling holds for a slot the body never carries", () => {
    const [kind, , absent] = TEMPLATE.slots;
    assert.ok(kind && absent);
    assert.equal(slotIsDangling(TEMPLATE, kind), false);
    assert.equal(slotIsDangling(TEMPLATE, absent), true);
});
