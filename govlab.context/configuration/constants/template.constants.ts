const DIMENSION = "dimension";
const NODE = "node";
const SUBSTRATE_NODE = "substrate-node";

export const MATH_TYPE_KIND = "math-type";

export const FIELD_KINDS_BY_ARRAY: ReadonlyMap<string, ReadonlyMap<string, string>> = new Map([
    ["ontological_dimensions", new Map([["id", DIMENSION]])],
    ["analytical_lenses", new Map([["id", "lens"]])],
    ["teleology_nodes", new Map([["id", NODE]])],
    ["verification_nodes", new Map([["id", NODE]])],
    ["termination_nodes", new Map([["id", NODE]])],
    ["genesis_grammar", new Map([["stage", SUBSTRATE_NODE]])],
]);

export const LIST_KINDS_BY_ARRAY: ReadonlyMap<string, string> = new Map([["substrate_cycle", SUBSTRATE_NODE]]);

export const FIELD_KINDS_ANYWHERE: ReadonlyMap<string, string> = new Map([["mathType", MATH_TYPE_KIND]]);

export const HEADER_KINDS = ["layer", "axis", MATH_TYPE_KIND] as const;

export const SET_OPEN = "SET ";

export const SET_ASSIGN = " = [";

export const ARRAY_CLOSE = "]";

export const QUOTE = '"';

export const FIELD_OPEN = ': "';

export const NODE_HEADER = "# NODE ";

export const HEADER_OPEN = "[";

export const HEADER_SEPARATOR = " · ";

export const MATH_JOINER = " + ";

export const MATH_PLUS = "+";

export const SPINE_HEAD = "# node";

export const SPINE_COLUMNS = ["layer", "axis", "mathType"] as const;

export const COMMENT = "#";

export const PLACEHOLDER_MARKS = ["{", "<"] as const;

export const FIELD_BOUNDARIES: ReadonlySet<string> = new Set([" ", "{", ","]);

export const ROW_DASH = "-";
