import {
    edgeKindOf,
    mechanismOf,
    scopeSeparationRule,
    tradeoffRule,
} from "@govlab/context/configuration/strings/layer.strings.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const PAIR = { a: "speed-rule", b: "care-rule", scopeA: "runtime", scopeB: "domain" };

test("the layer subjects name the edge and the tension they describe", () => {
    assert.ok(edgeKindOf("a", "b").includes("a → b"));
    assert.ok(mechanismOf("a", "b").includes("a / b"));
});

test("both tension rules name the two principles and their layers", () => {
    for (const rule of [scopeSeparationRule(PAIR), tradeoffRule(PAIR)]) {
        for (const part of Object.values(PAIR)) {
            assert.ok(rule.includes(part), part);
        }
    }
});
