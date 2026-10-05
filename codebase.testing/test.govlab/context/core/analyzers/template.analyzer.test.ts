import { templateRefsOf, unresolvedTemplateRefsOf } from "@govlab/context/core/analyzers/template.analyzer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const TEMPLATE = [
    "# node       layer       axis           mathType             yields",
    "# ---------- ----------- -------------- -------------------- ------------------",
    "# orient     epistemic   ontology       set-theory           baseline",
    "# commit     evaluative  representation information-theory   registry regen",
    "# verify     evaluative  verification   logic + probability  proof",
    "",
    'SET substrate_cycle = ["existence", "difference"]',
    "SET genesis_grammar = [",
    '  {stage: "existence", mathType: "set-theory", yields: "set"},',
    "]",
    "SET ontological_dimensions = [",
    '  {id: "behavior", asks: "what does it do?", mathType: "dynamical-systems"},',
    "]",
    "SET analytical_lenses = [",
    '  {id: "structure", asks: "how is it arranged?", mathType: "algebra"},',
    "]",
    "SET teleology_nodes = [",
    '  {id: "tel-priority", asks: "worth it?", yields: "boolean"},',
    "]",
    "SET relevant_docs = [",
    '  {id: "readme", path: "{project.root}/README.md"},',
    "]",
    "# NODE 1 — ORIENT      [epistemic · ontology · set-theory · yields: baseline]",
    '  {id: "{slot}", mathType: "<chosen>"}',
].join("\n");

const MEMBERS: ReadonlyMap<string, ReadonlySet<string>> = new Map([
    ["axis", new Set(["ontology", "representation", "verification"])],
    ["dimension", new Set(["behavior"])],
    ["layer", new Set(["epistemic", "evaluative"])],
    ["lens", new Set(["structure"])],
    [
        "math-type",
        new Set(["set-theory", "information-theory", "logic", "probability", "dynamical-systems", "algebra"]),
    ],
    ["node", new Set(["tel-priority"])],
    ["substrate-node", new Set(["existence", "difference"])],
]);

const keysOf = (text: string): string[] =>
    templateRefsOf(text).map((ref) => `${ref.kind}:${ref.id}@${String(ref.line)}`);

test("templateRefsOf reads every reference form a template uses, and skips placeholders and local arrays", () => {
    assert.deepEqual(keysOf(TEMPLATE), [
        "layer:epistemic@3",
        "axis:ontology@3",
        "math-type:set-theory@3",
        "layer:evaluative@4",
        "axis:representation@4",
        "math-type:information-theory@4",
        "layer:evaluative@5",
        "axis:verification@5",
        "math-type:logic@5",
        "math-type:probability@5",
        "substrate-node:existence@7",
        "substrate-node:difference@7",
        "substrate-node:existence@9",
        "math-type:set-theory@9",
        "dimension:behavior@12",
        "math-type:dynamical-systems@12",
        "lens:structure@15",
        "math-type:algebra@15",
        "node:tel-priority@18",
        "layer:epistemic@23",
        "axis:ontology@23",
        "math-type:set-theory@23",
    ]);
});

test("unresolvedTemplateRefsOf passes a template whose ids all resolve", () => {
    assert.deepEqual(unresolvedTemplateRefsOf(TEMPLATE, MEMBERS), []);
});

test("unresolvedTemplateRefsOf reports a renamed id with its line and kind", () => {
    const stale = TEMPLATE.replace('{id: "structure"', '{id: "structural"').replace(
        'mathType: "dynamical-systems"',
        'mathType: "dynamical"',
    );
    assert.deepEqual(unresolvedTemplateRefsOf(stale, MEMBERS), [
        { id: "dynamical", kind: "math-type", line: 12 },
        { id: "structural", kind: "lens", line: 15 },
    ]);
});
