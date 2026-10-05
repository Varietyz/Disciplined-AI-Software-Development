import {
    checkMarkerOf,
    gateMarkerOf,
    parseCheck,
    parseResult,
    stepGate,
    withResultArms,
} from "@govlab/context/core/parsers/check.parser.ts";
import { LINE } from "./document.fixture.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("gateMarkerOf tells a live gate from a retired one", () => {
    assert.deepEqual(gateMarkerOf("HANDOFF GATE (evidence-bearing):"), { retired: false });
    assert.deepEqual(gateMarkerOf("VALIDATION GATE:"), { retired: true });
    assert.equal(gateMarkerOf("CONTRACT:"), null);
});

test("checkMarkerOf tells a live marker from a retired one", () => {
    assert.deepEqual(checkMarkerOf("[check] x (evidence: y)"), { marker: "[check]", retired: false });
    assert.deepEqual(checkMarkerOf("✅ x"), { marker: "✅", retired: true });
    assert.equal(checkMarkerOf("SET x = 1"), null);
});

test("parseCheck extracts the condition, the evidence and the population", () => {
    const check = parseCheck(
        "[check] every entry names its source (evidence: no entry with an empty source) over: entries measured: 12 / 12",
        "[check]",
        LINE,
    );
    assert.equal(check.condition, "every entry names its source");
    assert.equal(check.evidence, "no entry with an empty source");
    assert.deepEqual(check.population, { measured: "12", set: "entries", whole: "12" });
    const bare = parseCheck("[check] data loaded", "[check]", LINE);
    assert.equal(bare.evidence, null);
    assert.equal(bare.population, null);
});

test("parseResult reads the pass arm, every failure arm with its owner, and the unknown arm across continuations", () => {
    const first = parseResult("result: pass → NODE 3 SEE", LINE);
    assert.equal(first.pass, "NODE 3 SEE");
    const full = withResultArms(
        withResultArms(first, "| no admissible branch → REPAIR (owner: orient)"),
        "| unknown → BLOCKED",
    );
    assert.deepEqual(full.failures, [{ name: "no admissible branch", owner: "orient" }]);
    assert.equal(full.unknown, "BLOCKED");
    assert.equal(first.unknown, null, "the input result is not mutated");
});

test("parseResult reads the two-character arrow the grammar accepts beside the arrow sign", () => {
    const ascii = withResultArms(
        parseResult("result: pass -> NODE 4 | gap -> REPAIR (owner: NODE 1)", LINE),
        "| unknown -> BLOCKED",
    );
    assert.deepEqual(ascii, {
        failures: [{ name: "gap", owner: "NODE 1" }],
        line: LINE,
        pass: "NODE 4",
        unknown: "BLOCKED",
    });
    assert.equal(parseResult("result: pass NODE 4", LINE).pass, "", "an arm with no arrow names no next node");
});

test("stepGate consumes checks and clauses and closes on the first line after a result", () => {
    const open = { checks: [], line: LINE, refusal: null, result: null, standing: null };
    const checked = stepGate(open, "[check] a (evidence: x)", LINE);
    assert.equal(checked.consumed, true);
    assert.equal(checked.gate.checks.length, 1);
    const refused = stepGate(checked.gate, "refuse: the target moved", LINE);
    assert.equal(refused.gate.refusal, "the target moved");
    const resulted = stepGate(refused.gate, "result: pass → TERMINATE", LINE);
    const closed = stepGate(resulted.gate, "# NODE 2", LINE);
    assert.equal(closed.consumed, false);
    assert.equal(closed.closes, true);
    const retired = stepGate(open, "✅ x", LINE);
    assert.equal(retired.retired?.kind, "check");
});
