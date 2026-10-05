import type { Concept } from "#types/concept.types";

const AXIS = "axis";
const DIMENSION = "dimension";
const LENS = "lens";
const MATH_DOMAIN = "math-domain";
const MATH_TYPE = "math-type";
const MODE = "mode";
const PATTERN_TYPE = "pattern-type";
const REPRESENTATION = "representation";
const SUBSTRATE_NODE = "substrate-node";
const UNIVERSAL_AXIS = "universal-axis";

const reason = function reason(kind: string, id: string): string {
    return `reasoning:${kind}:${id}`;
};

const principle = function principle(id: string): string {
    return `architecture:${id}`;
};

const roles = function roles(id: string, kinds: readonly string[]): readonly string[] {
    return kinds.map((kind) => reason(kind, id));
};

export const CONCEPTS: readonly Concept[] = [
    { home: reason(DIMENSION, "structure"), id: "structure", members: roles("structure", [LENS, SUBSTRATE_NODE]) },
    { home: reason(DIMENSION, "time"), id: "time", members: roles("time", [LENS]) },
    { home: reason(DIMENSION, "space"), id: "space", members: roles("space", [LENS]) },
    { home: reason(DIMENSION, "relation"), id: "relation", members: roles("relation", [LENS, SUBSTRATE_NODE]) },
    { home: reason(DIMENSION, "behavior"), id: "behavior", members: roles("behavior", [LENS]) },
    { home: reason(DIMENSION, "function"), id: "function", members: roles("function", [LENS, REPRESENTATION]) },
    { home: reason(DIMENSION, "meaning"), id: "meaning", members: roles("meaning", [LENS]) },
    { home: reason(DIMENSION, "cause"), id: "cause", members: roles("cause", [LENS]) },
    { home: reason(DIMENSION, "change"), id: "change", members: roles("change", [LENS]) },
    { home: reason(MODE, "prediction"), id: "prediction", members: roles("prediction", [LENS]) },
    { home: reason(SUBSTRATE_NODE, "transformation"), id: "transformation", members: roles("transformation", [LENS]) },
    {
        home: reason(SUBSTRATE_NODE, "invariant"),
        id: "invariant",
        members: [...roles("invariant", [LENS]), principle("invariant")],
    },
    { home: reason(SUBSTRATE_NODE, "existence"), id: "existence", members: roles("existence", [UNIVERSAL_AXIS]) },
    { home: reason(SUBSTRATE_NODE, "information"), id: "information", members: roles("information", [PATTERN_TYPE]) },
    { home: reason(MATH_TYPE, "optimization"), id: "optimization", members: roles("optimization", [LENS, MODE]) },
    { home: reason(MODE, "formalization"), id: "formalization", members: roles("formalization", [AXIS]) },
    { home: reason(MODE, "abstraction"), id: "abstraction", members: [principle("abstraction")] },
    { home: reason(MODE, "reflection"), id: "reflection", members: [principle("reflection")] },
    { home: reason(AXIS, "verification"), id: "verification", members: [principle("verification")] },
    {
        home: reason(MATH_DOMAIN, "probability"),
        id: "probability",
        members: [
            ...roles("probability", [DIMENSION, MATH_TYPE, PATTERN_TYPE, REPRESENTATION]),
            reason(SUBSTRATE_NODE, "uncertainty"),
        ],
    },
    {
        home: reason(MATH_DOMAIN, "algebra"),
        id: "algebra",
        members: roles("algebra", [MATH_TYPE, PATTERN_TYPE, REPRESENTATION]),
    },
    {
        home: reason(MATH_DOMAIN, "geometry"),
        id: "geometry",
        members: roles("geometry", [PATTERN_TYPE, REPRESENTATION]),
    },
    {
        home: reason(MATH_DOMAIN, "topology"),
        id: "topology",
        members: roles("topology", [MATH_TYPE, PATTERN_TYPE, REPRESENTATION]),
    },
    {
        home: reason(MATH_DOMAIN, "logic"),
        id: "logic",
        members: roles("logic", [MATH_TYPE, PATTERN_TYPE, REPRESENTATION]),
    },
    { home: reason(MATH_DOMAIN, "number"), id: "number", members: roles("number", [PATTERN_TYPE, REPRESENTATION]) },
    {
        home: reason(MATH_DOMAIN, "combinatorics"),
        id: "combinatorics",
        members: roles("combinatorics", [PATTERN_TYPE]),
    },
    {
        home: reason(MATH_DOMAIN, "computation"),
        id: "computation",
        members: roles("computation", [MATH_TYPE, PATTERN_TYPE, REPRESENTATION]),
    },
    {
        home: reason(MATH_DOMAIN, "category-theory"),
        id: "category-theory",
        members: roles("category-theory", [PATTERN_TYPE, REPRESENTATION]),
    },
    {
        home: reason(MATH_DOMAIN, "information-theory"),
        id: "information-theory",
        members: roles("information-theory", [MATH_TYPE, REPRESENTATION]),
    },
    {
        home: reason(MATH_TYPE, "dynamical-systems"),
        id: "dynamical-systems",
        members: roles("dynamical-systems", [PATTERN_TYPE, REPRESENTATION]),
    },
    { home: reason(MATH_TYPE, "graph"), id: "graph", members: roles("graph", [REPRESENTATION]) },
    { home: reason(MATH_DOMAIN, "set-theory"), id: "set-theory", members: roles("set-theory", [MATH_TYPE]) },
    { home: reason(MATH_DOMAIN, "analysis"), id: "analysis", members: roles("analysis", [MATH_TYPE]) },
];

export const VARIANTS: ReadonlyMap<string, string> = new Map([
    ["algebraic", "algebra"],
    ["behaviour", "behavior"],
    ["behavioural", "behavior"],
    ["categorical", "category-theory"],
    ["causal", "cause"],
    ["combinatorial", "combinatorics"],
    ["computational", "computation"],
    ["dynamical", "dynamical-systems"],
    ["evolutionary", "change"],
    ["formalisation", "formalization"],
    ["functional", "function"],
    ["generalisation", "generalization"],
    ["geometric", "geometry"],
    ["graphical", "graph"],
    ["information-theoretic", "information-theory"],
    ["invariants", "invariant"],
    ["logical", "logic"],
    ["numerical", "number"],
    ["optimisation", "optimization"],
    ["predictive", "prediction"],
    ["probabilistic", "probability"],
    ["relational", "relation"],
    ["semantic", "meaning"],
    ["spatial", "space"],
    ["structural", "structure"],
    ["temporal", "time"],
    ["topological", "topology"],
    ["transformational", "transformation"],
]);
