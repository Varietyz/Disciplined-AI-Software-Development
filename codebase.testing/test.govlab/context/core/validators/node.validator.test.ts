import { LINE, emptyDoc, nodeWith } from "../parsers/document.fixture.ts";
import type { PagCheck, PagDocument } from "@govlab/context/types/grammar.document.types.ts";
import { gateDefects, nodeDefects } from "@govlab/context/core/validators/node.validator.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const openGate = { checks: [], line: LINE, refusal: null, result: null, standing: null };

const check = (condition: string, evidence: string | null): PagCheck => ({
    condition,
    evidence,
    line: LINE,
    marker: "[check]",
    population: null,
});

test("nodeDefects reports the node-level codes and passes a sound node", () => {
    const writing = nodeWith({
        gate: openGate,
        input: "raw task text",
        tag: { axis: "representation", layer: "evaluative", mathType: "information-theory", yields: "artifact" },
        transform: "PERSIST_ARTIFACT rendered TO {target}",
    });
    assert.deepEqual(
        nodeDefects(writing, emptyDoc()).map((defect) => defect.code),
        ["input_without_source", "write_without_refusal", "artifact_without_freshness"],
    );
    const sound = nodeWith({
        freshness: "inputs + code",
        gate: { ...openGate, refusal: "the destination moved" },
        input: "results from NODE 2",
        transform: "PERSIST_ARTIFACT results TO {target}",
    });
    assert.deepEqual(nodeDefects(sound, emptyDoc()), []);
    assert.deepEqual(
        nodeDefects(nodeWith({ gate: null, tag: null }), emptyDoc()).map((defect) => defect.code),
        ["node_tag_malformed", "node_without_gate"],
    );
});

test("nodeDefects accepts an input naming a variable a node declares", () => {
    const declaring = nodeWith({ directives: ["DECLARE context_bundle: object"] });
    const reader = nodeWith({ gate: openGate, input: "context_bundle" });
    const doc: PagDocument = { ...emptyDoc(), nodes: [declaring, reader] };
    assert.deepEqual(nodeDefects(reader, doc), []);
});

test("nodeDefects accepts the first node's input when the meta jurisdiction names it, and reports it when it does not", () => {
    const entry = nodeWith({ gate: openGate, input: "the locale dictionary" });
    const inside: PagDocument = {
        ...emptyDoc(),
        meta: { jurisdiction: "the locale dictionary under the dictionaries root | external: the source catalog" },
        nodes: [entry],
    };
    assert.deepEqual(nodeDefects(entry, inside), []);
    const outside: PagDocument = { ...inside, meta: { jurisdiction: "another surface" } };
    assert.deepEqual(
        nodeDefects(entry, outside).map((defect) => defect.code),
        ["input_without_source"],
    );
});

test("gateDefects reports the gate-level codes and passes a sound gate", () => {
    const weak = nodeWith({
        gate: {
            ...openGate,
            checks: [check("looks good", null), check("b", "x"), check("c", "y")],
            result: { failures: [], line: LINE, pass: "NODE 4", unknown: null },
        },
    });
    assert.deepEqual(
        gateDefects(weak).map((defect) => defect.code),
        ["gate_without_population", "vague_condition", "check_without_evidence", "unknown_unrouted"],
    );
    const empty = nodeWith({
        gate: {
            ...openGate,
            checks: [{ ...check("a", "x"), population: { measured: "0", set: "files", whole: "0" } }],
        },
    });
    assert.deepEqual(
        gateDefects(empty).map((defect) => defect.code),
        ["gate_too_few_conditions", "empty_population", "result_missing"],
    );
    const sound = nodeWith({
        gate: {
            ...openGate,
            checks: [
                { ...check("a", "x"), population: { measured: "3", set: "files", whole: "3" } },
                check("b", "y"),
                check("c", "z"),
            ],
            result: { failures: [{ name: "gap", owner: "NODE 1" }], line: LINE, pass: "NODE 2", unknown: "BLOCKED" },
        },
    });
    assert.deepEqual(gateDefects(sound), []);
    assert.deepEqual(gateDefects(nodeWith({ gate: null })), []);
});
