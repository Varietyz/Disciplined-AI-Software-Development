import {
    idShapedEdgeLabelsOf,
    reasonDefectLines,
    unresolvedLensDetectorsOf,
    unresolvedReasonEdgesOf,
    unresolvedShapeInstancesOf,
} from "@govlab/context/core/validators/reason.reference.validator.ts";
import assert from "node:assert/strict";
import { createReason } from "@govlab/context";
import { test } from "vitest";

const SHARED_ID = "invariant";

const algoWith = (ids: ReadonlySet<string>): { get: (id: string) => { id: string } | null } => ({
    get: (id) => (ids.has(id) ? { id } : null),
});

const reasonFaces = {
    axes: () => [],
    kindMembers: () =>
        new Map([
            ["lens", new Set(["cause", SHARED_ID])],
            ["substrate-node", new Set([SHARED_ID])],
        ]),
    models: () => [],
    resolve: () => null,
};

test("unresolvedReasonEdgesOf reports an edge target that resolves to nothing", () => {
    const faces = {
        algo: algoWith(new Set(["yes"])),
        reason: { edges: () => [{ to: "algorithms:nope" }, { to: "algorithms:yes" }] },
    };
    assert.deepEqual(unresolvedReasonEdgesOf(faces), ["algorithms:nope"]);
});

test("unresolvedReasonEdgesOf ignores a free label edge with no target", () => {
    const faces = { algo: algoWith(new Set()), reason: { edges: () => [{}] } };
    assert.deepEqual(unresolvedReasonEdgesOf(faces), []);
});

test("unresolvedLensDetectorsOf reports a detector that resolves to no algorithm record", () => {
    const faces = {
        algo: algoWith(new Set(["real-detector"])),
        reason: {
            lenses: () => [
                { detectedBy: ["algorithms:ghost-detector", "algorithms:real-detector"], id: "sequential" },
                { id: "structural" },
            ],
        },
    };
    assert.deepEqual(unresolvedLensDetectorsOf(faces), [{ lens: "sequential", target: "algorithms:ghost-detector" }]);
});

test("unresolvedShapeInstancesOf reports each instance the resolver refuses", () => {
    const faces = {
        algo: algoWith(new Set(["real-contract"])),
        reason: {
            ...reasonFaces,
            failureShapes: () => [{ id: "planted-shape", instances: ["algorithms:real-contract", "algorithms:ghost"] }],
        },
    };
    assert.deepEqual(unresolvedShapeInstancesOf(faces), [{ instance: "algorithms:ghost", shape: "planted-shape" }]);
});

test("idShapedEdgeLabelsOf reports an id-shaped label that resolves to nothing, and passes prose", () => {
    const faces = {
        algo: algoWith(new Set()),
        reason: {
            ...reasonFaces,
            edges: () => [
                { from: "x", label: "claims-need-evidence" },
                { from: "y", label: "an unverified claim carries no weight" },
            ],
        },
    };
    assert.deepEqual(idShapedEdgeLabelsOf(faces), [{ from: "x", label: "claims-need-evidence" }]);
});

test("reasonDefectLines writes one line per issue and none for the bundled ontology", () => {
    assert.deepEqual(reasonDefectLines(createReason().validateReasonOntology()), []);
    const issues = {
        ...createReason().validateReasonOntology(),
        danglingEdgeSources: ["ghost"],
        duplicateIds: ["node:n1"],
    };
    assert.equal(reasonDefectLines(issues).length, 2);
});
