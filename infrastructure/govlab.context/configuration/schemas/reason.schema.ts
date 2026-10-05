import {
    CLOSED,
    FLAG,
    ID,
    LABEL,
    LABELS,
    OBJECT,
    OPTIONAL_LABEL,
    OPTIONAL_LABELS,
    OPTIONAL_OBJECT,
    OPTIONAL_TEXT,
    TEXT,
} from "#configuration/constants/field.constants";
import { freeRefs, kept, listedBy, optionalRef, optionalRefs, ref, refs } from "#core/factories/field.factory";
import type { KindSchema } from "#types/field.types";
import { REASON_COLLECTION } from "#configuration/constants/reason.constants";

const at = function at(kind: string): string {
    return `${REASON_COLLECTION}:${kind}`;
};

const SURFACES = "surfaces";
const TECHNIQUES = "techniques";
const GROUNDS = "grounds";
const GROUNDED_BY = "grounded-by";

const AXIS = at("axis");
const DIMENSION = at("dimension");
const INVARIANT = at("invariant");
const LAYER = at("layer");
const MATH_DOMAIN = at("math-domain");
const MATH_TYPE = at("math-type");
const MODE = at("mode");
const NODE = at("node");

const KIND_SCHEMAS: readonly (readonly [string, KindSchema])[] = [
    [
        "axis",
        {
            id: ID,
            layer: ref(LAYER, "axes"),
            mandatory: TEXT,
            primaryMathType: ref(MATH_TYPE),
            question: TEXT,
            selectable: FLAG,
        },
    ],
    ["dimension", { id: ID, mathDomains: optionalRefs(MATH_DOMAIN), mathNature: LABEL, question: TEXT }],
    [
        "failure-shape",
        {
            breaks: ref(INVARIANT),
            canon: LABELS,
            fix: TEXT,
            id: ID,
            instances: OPTIONAL_LABELS,
            name: LABEL,
            shape: TEXT,
        },
    ],
    ["invariant", { id: ID, name: LABEL, statement: TEXT }],
    ["layer", { id: ID, label: LABEL, question: TEXT }],
    [
        "lens",
        {
            detectedBy: freeRefs("detects"),
            id: ID,
            label: OPTIONAL_LABEL,
            mathDomains: optionalRefs(MATH_DOMAIN),
            mathFields: OPTIONAL_LABELS,
            nature: LABEL,
            question: TEXT,
            surfaces: OPTIONAL_LABELS,
            universalAxis: ref(at("universal-axis"), "lenses"),
        },
    ],
    ["math-domain", { id: ID, question: TEXT, studies: TEXT }],
    [
        "math-type",
        { domains: optionalRefs(MATH_DOMAIN), id: ID, predicateFamily: LABEL, question: TEXT, yieldsShape: LABEL },
    ],
    ["mode", { id: ID, practice: TEXT, question: OPTIONAL_TEXT }],
    ["model", { id: ID, question: TEXT, recursion: OPTIONAL_OBJECT, sequence: LABELS, stepKind: LABEL }],
    [
        "node",
        {
            answerShape: OPTIONAL_LABEL,
            axis: ref(AXIS, "nodes"),
            concept: { required: false, type: "ref" },
            decisionTest: OPTIONAL_TEXT,
            id: ID,
            mathType: ref(MATH_TYPE),
            name: LABEL,
            question: OPTIONAL_TEXT,
            role: OPTIONAL_LABEL,
        },
    ],
    ["pattern-type", { id: ID, label: OPTIONAL_LABEL, viewpoint: TEXT }],
    ["representation", { expression: TEXT, id: ID, label: OPTIONAL_LABEL }],
    ["substrate-node", { id: ID, layer: ref(LAYER), mathType: ref(MATH_TYPE), name: LABEL }],
    [
        "technique",
        {
            fails: TEXT,
            id: ID,
            mode: listedBy(ref(MODE, TECHNIQUES), TECHNIQUES),
            principle: TEXT,
            principleRef: listedBy(optionalRef("architecture"), TECHNIQUES),
        },
    ],
    [
        "test-surface",
        {
            dimension: ref(DIMENSION, SURFACES),
            evidence: OBJECT,
            "evidence.grounds": kept(optionalRefs(NODE, GROUNDED_BY), GROUNDS),
            "evidence.required": FLAG,
            "evidence.source": CLOSED,
            failureModes: LABELS,
            fit: TEXT,
            id: ID,
            invariant: ref(INVARIANT, SURFACES),
            lens: ref(at("lens"), "testSurfaces"),
            predicate: OBJECT,
            "predicate.expression": TEXT,
            "predicate.grounds": kept(optionalRefs(NODE, GROUNDED_BY), GROUNDS),
            "predicate.type": CLOSED,
            techniques: refs(at("technique"), SURFACES),
            verdictDomain: LABELS,
        },
    ],
    ["universal-axis", { id: ID, question: TEXT, subsumes: refs(DIMENSION) }],
];

const STRUCTURE_SCHEMAS: readonly (readonly [string, KindSchema])[] = [
    ["loop", { id: ID }],
    ["stage", { axis: ref(AXIS), id: ID }],
    ["edge", { from: LABEL, label: OPTIONAL_LABEL, to: { inverse: GROUNDED_BY, required: false, type: "ref" } }],
];

export const REASON_SCHEMA: ReadonlyMap<string, KindSchema> = new Map<string, KindSchema>([
    ...KIND_SCHEMAS.map(([kind, schema]): [string, KindSchema] => [kind, { ...schema, aliases: OPTIONAL_LABELS }]),
    ...STRUCTURE_SCHEMAS,
]);
