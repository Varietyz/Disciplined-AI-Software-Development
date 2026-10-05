import { CONCEPT_COLLECTION_BY_AXIS } from "@govlab/context/configuration/constants/reason.constants.ts";
import type { ReasonData } from "@govlab/context/types/reason.types.ts";
import assert from "node:assert/strict";
import { bundledReason } from "./ontology.fixture.ts";
import { test } from "vitest";
import { validateReason } from "@govlab/context/core/validators/reason.validator.ts";

const SURFACE_KIND = "test-surface";

const goodData = (): ReasonData => ({
    axes: [{ id: "a1", layer: "l1", mandatory: "yes", primaryMathType: "m1", question: "q", selectable: true }],
    derivationLoop: {
        id: "dl",
        stages: [{ axis: "a1", id: "s1" }],
        transitions: [{ from: "s1", kind: "advance", to: "s1" }],
    },
    dimensions: [],
    edges: [{ from: "n1", to: "algorithms:x" }],
    failureShapes: [],
    invariants: [],
    layers: [{ id: "l1", label: "L1", question: "q" }],
    lenses: [],
    maps: { foundations: { layers: {}, sequence: [] }, invariants: {}, patternOperations: [] },
    mathDomains: [],
    mathTypes: [{ domains: [], id: "m1", predicateFamily: "pf", question: "q", yieldsShape: "shape" }],
    models: [],
    modes: [],
    nodes: [{ axis: "a1", id: "n1", mathType: "m1", name: "N1" }],
    patternTypes: [],
    representations: [],
    substrate: { cycle: [], nodes: [], recursion: { from: "", to: "" } },
    techniques: [],
    testSurfaces: [],
    universalAxes: [],
});

const surfaceData = (): ReasonData => {
    const data = goodData();
    data.dimensions = [{ id: "meaning", mathDomains: [], mathNature: "n", question: "q" }];
    data.lenses = [
        { id: "semantic", mathDomains: [], mathFields: [], nature: "n", question: "q", universalAxis: "u1" },
    ];
    data.universalAxes = [{ id: "u1", question: "q", subsumes: ["meaning"] }];
    data.modes = [{ id: "comparison", practice: "p" }];
    data.nodes = [
        { axis: "a1", id: "n1", mathType: "m1", name: "N1" },
        { axis: "a1", id: "ver-ground-truth", mathType: "m1", name: "Ground Truth" },
        { axis: "a1", id: "ver-evidence", mathType: "m1", name: "Evidence" },
    ];
    data.techniques = [{ fails: "passes on stale doubles", id: "unit-testing", mode: "comparison", principle: "p" }];
    data.invariants = [{ id: "correct-outputs", name: "Correct Outputs", statement: "s" }];
    data.testSurfaces = [
        {
            dimension: "meaning",
            evidence: { grounds: ["ver-evidence"], required: true, source: "test-result" },
            failureModes: ["a stale expected value"],
            fit: "the meaning of the result is compared with the meaning expected",
            id: "s-sem",
            invariant: "correct-outputs",
            lens: "semantic",
            predicate: { expression: "x", grounds: ["ver-ground-truth"], type: "equivalence" },
            techniques: ["unit-testing"],
            verdictDomain: ["pass", "fail", "unknown"],
        },
    ];
    return data;
};

const firstSurface = (data: ReasonData): ReasonData["testSurfaces"][number] => {
    const [surface] = data.testSurfaces;
    assert.ok(surface, "expected a test surface");
    return surface;
};

const dangles = (data: ReasonData, kind: string, field: string, value: string): boolean =>
    validateReason(data).danglingFields.some(
        (entry) => entry.kind === kind && entry.field === field && entry.value === value,
    );

const emptied = (data: ReasonData): string[] =>
    validateReason(data).emptyFields.map((entry) => `${entry.kind}:${entry.id}:${entry.field}`);

const danglingOf = (data: ReasonData, kind: string): { field: string; id: string; value: string }[] =>
    validateReason(data)
        .danglingFields.filter((entry) => entry.kind === kind)
        .map(({ field, id, value }) => ({ field, id, value }));

test("validateReason is clean on well-formed data and on the surface baseline", () => {
    assert.equal(validateReason(goodData()).total, 0);
    assert.equal(validateReason(surfaceData()).total, 0);
});

test("validateReason reports a duplicate id", () => {
    const data = goodData();
    data.nodes = [
        { axis: "a1", id: "n1", mathType: "m1", name: "N1" },
        { axis: "a1", id: "n1", mathType: "m1", name: "N1" },
    ];
    const issues = validateReason(data);
    assert.ok(issues.duplicateIds.includes("node:n1"), JSON.stringify(issues.duplicateIds));
    assert.ok(issues.total > 0);
});

test("validateReason reports a node, axis, substrate node or lens field that names no record", () => {
    const axis = goodData();
    axis.nodes = [{ axis: "aX", id: "n1", mathType: "m1", name: "N1" }];
    assert.ok(dangles(axis, "node", "axis", "aX"));
    const mathType = goodData();
    mathType.nodes = [{ axis: "a1", id: "n1", mathType: "mZ", name: "N1" }];
    assert.ok(dangles(mathType, "node", "mathType", "mZ"));
    const primary = goodData();
    primary.axes = [
        { id: "a1", layer: "l1", mandatory: "yes", primaryMathType: "mZ", question: "q", selectable: true },
    ];
    assert.ok(dangles(primary, "axis", "primaryMathType", "mZ"));
    const substrate = goodData();
    substrate.substrate = {
        cycle: [],
        nodes: [{ id: "s1", layer: "l1", mathType: "mZ", name: "s1" }],
        recursion: { from: "", to: "" },
    };
    assert.ok(dangles(substrate, "substrate-node", "mathType", "mZ"));
    const lens = goodData();
    lens.lenses = [{ id: "lens1", mathDomains: [], mathFields: [], nature: "n", question: "q", universalAxis: "uZ" }];
    assert.ok(dangles(lens, "lens", "universalAxis", "uZ"));
});

test("validateReason reports a loop transition to a non-stage, and an edge source that is neither node nor stage", () => {
    const transition = goodData();
    transition.derivationLoop.transitions = [{ from: "s1", kind: "advance", to: "sZ" }];
    assert.ok(
        validateReason(transition).danglingTransitions.some(
            (entry) => entry.to === "sZ" && entry.reason.includes("to is not a stage"),
        ),
    );
    const edge = goodData();
    edge.edges = [{ from: "ghost", to: "algorithms:x" }];
    assert.ok(validateReason(edge).danglingEdgeSources.includes("ghost"));
});

test("validateReason reports a surface field that names no record", () => {
    const cases: [string, (surface: ReasonData["testSurfaces"][number]) => void, string][] = [
        [
            "dimension",
            (surface) => {
                surface.dimension = "ghost";
            },
            "ghost",
        ],
        [
            "lens",
            (surface) => {
                surface.lens = "ghost";
            },
            "ghost",
        ],
        [
            "techniques",
            (surface) => {
                surface.techniques = ["ghost"];
            },
            "ghost",
        ],
        [
            "invariant",
            (surface) => {
                surface.invariant = "ghost";
            },
            "ghost",
        ],
        [
            "predicate.grounds",
            (surface) => {
                surface.predicate.grounds = ["ghost"];
            },
            "ghost",
        ],
        [
            "evidence.grounds",
            (surface) => {
                surface.evidence.grounds = ["ghost"];
            },
            "ghost",
        ],
    ];
    for (const [field, plant, value] of cases) {
        const data = surfaceData();
        plant(firstSurface(data));
        assert.ok(dangles(data, SURFACE_KIND, field, value), field);
    }
});

test("validateReason reports a technique whose mode names no mode", () => {
    const data = surfaceData();
    const [technique] = data.techniques;
    assert.ok(technique, "expected a technique");
    technique.mode = "ghost-mode";
    assert.ok(dangles(data, "technique", "mode", "ghost-mode"));
});

test("validateReason reports a surface with no techniques, an empty verdict domain, or a blank predicate", () => {
    const techniques = surfaceData();
    firstSurface(techniques).techniques = [];
    assert.deepEqual(emptied(techniques), ["test-surface:s-sem:techniques"]);
    const verdicts = surfaceData();
    firstSurface(verdicts).verdictDomain = [];
    assert.deepEqual(emptied(verdicts), ["test-surface:s-sem:verdictDomain"]);
    const predicate = surfaceData();
    firstSurface(predicate).predicate.expression = "   ";
    assert.deepEqual(emptied(predicate), ["test-surface:s-sem:predicate.expression"]);
});

test("validateReason reports two surfaces colliding on one dimension and lens cell", () => {
    const data = surfaceData();
    data.testSurfaces.push({ ...firstSurface(data), id: "s-sem-2" });
    const issues = validateReason(data);
    assert.ok(
        issues.collidingSurfaceCells.some(
            (entry) => entry.surfaces.includes("s-sem") && entry.surfaces.includes("s-sem-2"),
        ),
    );
});

test("an answer shape outside what the node's math type yields is reported", () => {
    const data = bundledReason();
    assert.deepEqual(validateReason(data).answerShapeMismatches, []);
    const planted = {
        ...data,
        nodes: data.nodes.map((node) => (node.id === "ter-block" ? { ...node, answerShape: "ranking" } : node)),
    };
    assert.deepEqual(validateReason(planted).answerShapeMismatches, [
        { allowed: "boolean", answerShape: "ranking", node: "ter-block" },
    ]);
});

test("a model step that is not a record of the model's declared step kind is reported", () => {
    const data = bundledReason();
    assert.deepEqual(validateReason(data).unresolvedModelSteps, []);
    const planted = {
        ...data,
        models: data.models.map((model) =>
            model.id === "epistemology" ? { ...model, sequence: [...model.sequence, "guessing"] } : model,
        ),
    };
    assert.deepEqual(validateReason(planted).unresolvedModelSteps, [
        { model: "epistemology", step: "guessing", stepKind: "mode" },
    ]);
});

test("a failure shape that names no invariant, or no quality concept, is reported", () => {
    const data = bundledReason();
    assert.deepEqual(validateReason(data).danglingFields, []);
    assert.deepEqual(validateReason(data).emptyFields, []);
    const ghost = { breaks: "epi-ghost", canon: [], fix: "f", id: "ghost-shape", instances: [], name: "G", shape: "s" };
    const planted = { ...data, failureShapes: [...data.failureShapes, ghost] };
    assert.deepEqual(danglingOf(planted, "failure-shape"), [
        { field: "breaks", id: "ghost-shape", value: "epi-ghost" },
    ]);
    assert.deepEqual(validateReason(planted).emptyFields, [
        { field: "canon", id: "ghost-shape", kind: "failure-shape" },
    ]);
});

test("a technique with no fails and a surface with no fit are reported empty", () => {
    const data = bundledReason();
    const [technique] = data.techniques;
    const [surface] = data.testSurfaces;
    assert.ok(technique && surface);
    const failless = { ...data, techniques: [{ ...technique, fails: "" }, ...data.techniques.slice(1)] };
    assert.deepEqual(validateReason(failless).emptyFields, [{ field: "fails", id: technique.id, kind: "technique" }]);
    const fitless = { ...data, testSurfaces: [{ ...surface, fit: " " }, ...data.testSurfaces.slice(1)] };
    assert.deepEqual(validateReason(fitless).emptyFields, [{ field: "fit", id: surface.id, kind: "test-surface" }]);
});

test("a reference to a missing layer, math domain or representation is reported", () => {
    const data = bundledReason();
    assert.deepEqual(validateReason(data).danglingConcepts, []);
    const [axis] = data.axes;
    const [mathType] = data.mathTypes;
    const represented = data.nodes.find(
        (node) => CONCEPT_COLLECTION_BY_AXIS.get(node.axis) === "representation" && typeof node.concept === "string",
    );
    if (axis === undefined || mathType === undefined || represented === undefined) {
        throw new Error("the bundled reasoning data holds no axis, math type or representation node to plant on");
    }
    const planted = validateReason({
        ...data,
        axes: data.axes.map((entry) => (entry.id === axis.id ? { ...entry, layer: "ghost-layer" } : entry)),
        mathTypes: data.mathTypes.map((entry) =>
            entry.id === mathType.id ? { ...entry, domains: [...entry.domains, "ghost-domain"] } : entry,
        ),
        nodes: data.nodes.map((node) => (node.id === represented.id ? { ...node, concept: "ghost-form" } : node)),
    });
    assert.deepEqual(
        planted.danglingFields.map(({ field, id, kind, value }) => ({ field, id, kind, value })),
        [
            { field: "layer", id: axis.id, kind: "axis", value: "ghost-layer" },
            { field: "domains", id: mathType.id, kind: "math-type", value: "ghost-domain" },
        ],
    );
    assert.deepEqual(planted.danglingConcepts, [{ concept: "ghost-form", node: represented.id }]);
});
