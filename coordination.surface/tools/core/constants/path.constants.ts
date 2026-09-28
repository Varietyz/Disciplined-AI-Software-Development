import { isResolved, slotList, slotText, surfacePath, surfacePrefix } from "../../../config/surface.config.ts";

export const GENERATED_DIR = surfacePath("generated");

export const NODE_MODULES = "node_modules";

export const SURFACE_ROOT = surfacePrefix();

export const UPSTREAM_ROOTS: readonly string[] = [
    ...slotList("project", "upstream_roots"),
    ...slotList("surface", "upstream").map((root) => (SURFACE_ROOT.length === 0 ? root : `${SURFACE_ROOT}/${root}`)),
];

export const NO_FIX_FLAG = "--rehearse";

export const BEHAVIOUR_DOCUMENT = surfacePath("axis_document");

export const BOOTSTRAP_DOCUMENT = surfacePath("bootstrap");

export const BEHAVIOUR_TREE_PLACEHOLDER = ".{provider}";

export const PACKAGE_MANIFEST = "package.json";

export const AXIS_DOCUMENTS: readonly string[] = isResolved("project", "architecture_rules")
    ? [BEHAVIOUR_DOCUMENT, slotText("project", "architecture_rules")]
    : [BEHAVIOUR_DOCUMENT];

export const PRINCIPLE_CATALOG: string | null = isResolved("project", "principle_ontology")
    ? slotText("project", "principle_ontology")
    : null;

export const BINARY_EXTENSIONS: readonly string[] = slotList("convention", "binary_extensions");

export const AUTHORED_ROOTS: readonly string[] = [SURFACE_ROOT];

export const ENTRYPOINT_ROOTS: readonly string[] = [`${surfacePath("entrypoints")}/`];

export const OPT_IN_MUTATION_FLAGS: readonly string[] = ["--fix", "--apply", "--write", "--commit"];

export const MUTATION_FIELDS: readonly string[] = ["fix", "heal", "mutate", "apply", "write"];

export const PRESENCE_READERS: readonly string[] = ["activeAgents", "activeSeats", "activeSet", "boardRecords"];

export const GUARD_RESOLUTION_DEPTH = 4;

export const PIPELINE_ENTRY = "runPipeline";

export const REPORT_CALL = "writePipelineReport";
