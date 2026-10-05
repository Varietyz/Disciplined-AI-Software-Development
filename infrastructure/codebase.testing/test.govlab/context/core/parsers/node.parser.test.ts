import { LINE, NODE_HEADER } from "./document.fixture.ts";
import { nodeFieldOf, nodeOf, parseHeader, parseTag } from "@govlab/context/core/parsers/node.parser.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

test("parseTag reads the four slots and refuses a tag with fewer", () => {
    assert.deepEqual(parseTag(NODE_HEADER), {
        axis: "analysis",
        layer: "epistemic",
        mathType: "graph",
        yields: "lens-set + analytic edges",
    });
    assert.equal(parseTag("NODE 1 — X [epistemic · ontology]"), null);
    assert.equal(parseTag("NODE 1 — X"), null);
});

test("parseHeader classifies a node, a retired unit, the invariant block, the repair edge and a comment", () => {
    const node = parseHeader(NODE_HEADER);
    assert.equal(node.kind, "node");
    assert.equal(node.number, "3");
    assert.equal(node.title, "SEE");
    const retired = parseHeader("PHASE 2: Execution");
    assert.equal(retired.kind, "retired-unit");
    assert.equal(retired.number, "2");
    assert.equal(retired.title, "Execution");
    assert.equal(parseHeader("CROSS-NODE INVARIANTS  (bind every node)").kind, "invariants");
    assert.equal(parseHeader("REPAIR EDGE  (verify --refutes-back--> earliest invalid node)").kind, "repair");
    assert.equal(parseHeader("OUTPUT CONTRACT").kind, "comment");
    assert.equal(parseHeader("=====").kind, "comment");
});

test("nodeFieldOf reads a node field by its prefix and passes any other line", () => {
    assert.deepEqual(nodeFieldOf('@genesis: "relation"'), { field: "genesis", value: '"relation"' });
    assert.equal(nodeFieldOf("SET x = 1"), null);
});

test("nodeOf opens a node with its header and no fields", () => {
    const node = nodeOf(parseHeader(NODE_HEADER), NODE_HEADER, LINE);
    assert.equal(node.number, "3");
    assert.equal(node.line, LINE);
    assert.equal(node.gate, null);
    assert.deepEqual(node.directives, []);
});
