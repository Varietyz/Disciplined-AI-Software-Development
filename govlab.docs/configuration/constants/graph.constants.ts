import type { ClassDef } from "#types/diagram.types";
import type { CodeNodeKind } from "#types/graph.types";

export const NODE_KINDS: readonly string[] = [
    "entry",
    "factory",
    "method",
    "collaborator",
    "decision",
    "gate",
    "hook",
    "registry",
    "store",
    "exit",
    "fail-sink",
];

export const EDGE_KINDS: readonly string[] = [
    "call",
    "branch",
    "hook-register",
    "teardown",
    "data-flow",
    "dependency",
    "loop",
];

export const RECOGNIZER_NODE_KINDS: readonly string[] = [
    "collaborator",
    "decision",
    "gate",
    "hook",
    "registry",
    "store",
    "fail-sink",
];

export const RECOGNIZER_EDGE_KINDS: readonly string[] = ["branch", "hook-register", "teardown", "data-flow"];

export const CLASS_BY_KIND: ReadonlyMap<CodeNodeKind, string> = new Map<CodeNodeKind, string>([
    ["entry", "kEntry"],
    ["factory", "kEntry"],
    ["collaborator", "kCollab"],
    ["decision", "kGate"],
    ["gate", "kGate"],
    ["fail-sink", "kGate"],
    ["hook", "kHook"],
    ["registry", "kState"],
    ["store", "kState"],
]);

export const DEFAULT_CLASS = "kMethod";

export const CLASS_DEFS: readonly ClassDef[] = [
    { name: "kEntry", stroke: "#2f6f4f" },
    { name: "kCollab", stroke: "#7a5c1e" },
    { name: "kGate", stroke: "#8a3324" },
    { name: "kHook", stroke: "#3a5a8a" },
    { name: "kState", stroke: "#5a3a8a" },
    { name: "kMethod", stroke: "#555555" },
];

export const EDGE_BUDGET = 450;

export const MODULE_ID = "__module__";

export const DEFAULT_LABEL = "default";
