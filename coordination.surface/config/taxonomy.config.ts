export const LAYERS = [
    "domain",
    "application",
    "processing",
    "runtime",
    "infrastructure",
    "operations",
    "product",
] as const;

export type Layer = (typeof LAYERS)[number];

export interface CorpusRootDeclaration {
    readonly facetFields: readonly string[];
    readonly facetByValue: Readonly<Record<string, string>>;
    readonly variantByOrigin: Readonly<Record<string, string>>;
    readonly filedUnder: string;
}

export interface ArtifactRootDeclaration {
    readonly binding: string;
    readonly field: readonly string[];
    readonly subtrees: readonly string[];
}

const ARTIFACT_ROOTS: Readonly<Record<string, ArtifactRootDeclaration>> = {};

const CORPUS_ROOTS: Readonly<Record<string, CorpusRootDeclaration>> = {};

export const taxonomy = {
    Ignored: {
        foldersFiles: [
            "settings.json",
            "settings.local.json",
            "package.json",
            "package-lock.json",
            "tsconfig.json",
            "tsconfig.base.json",
            "_manifest.json",
            "node_modules",
            ".gitkeep",
            ".gitignore",
            "SKILL.md",
            "_generated",
            "_visualization-generated",
            "_fixtures",
        ],
    },
    foreignGrammar: { groupingDelimiters: [], ownershipManifests: [] },
    artifactRoots: ARTIFACT_ROOTS,
    corpusRoots: CORPUS_ROOTS,
    configRule:
        '"<root-path>": ["<container>", "<container>", ..] | A root-path is declared RELATIVE TO THE SURFACE ROOT and declares where the taxonomy is enforced. No declaration = no enforcement. specialContainers names containers that are flat buckets holding one collection concern. A host adds its own trees here; every key below governs this package alone.',
    containers: { ".{provider}": ["intel", "skills"], tools: ["core"] },
    specialContainers: {
        ".{provider}": ["rules", "templates", "bindings"],
        tools: ["rules"],
        ".": ["checklists", "findings", "templates", "models", "specifications", "roles", "config", "taxonomy"],
    },
    foreignContainers: { ".{provider}": ["agents"] },
    grammar: {
        case: "kebab",
        compoundMarkers: ["test", "spec", "d", "generated"],
        verificationMarkers: ["test", "spec"],
        file: ["<subject>.<concern>.<ext>", "<subject>.<variant>.<concern>.<ext>"],
        folder: { depthOne: ["<container>"], depthThree: ["<concern>"], depthTwo: ["<subject>", "<concern>"] },
        generatedFolder: { marker: "generated", prefix: "_" },
        folderRule:
            "depth counts folders from the governed root, container included, file excluded. roles resolve in the order container < subject < concern: each depth consumes a role strictly later than the depth before it, any role after the container may be skipped, and the file's parent always resolves to <concern>.",
        maxDepthFromRoot: 3,
        separator: ".",
    },
    boundaryDocuments: [
        "README.md",
        "AGENTS.md",
        "BOOTSTRAP.md",
        "LICENSE",
        "LICENSE.md",
        "SECURITY.md",
        "CONTRIBUTING.md",
        "CODE_OF_CONDUCT.md",
        "AI-CONTEXT.md",
        "_agenda.md",
        "_agent-index.md",
        "_changelogs.txt",
    ],
    reasoning: "taxonomy/placement.project.taxonomy.md",
    concerns: [
        { folder: "checklists", layer: "product", tag: "checklist" },
        { folder: "findings", layer: "product", tag: "finding" },
        { folder: "contracts", layer: "infrastructure", tag: "contract" },
        { folder: "specifications", layer: "domain", tag: "specification" },
        { folder: "schemas", layer: "infrastructure", tag: "schemas" },
        { folder: "types", layer: "infrastructure", tag: "types" },
        { folder: "constants", layer: "infrastructure", tag: "constants" },
        { folder: "strings", layer: "infrastructure", tag: "strings" },
        { folder: "predicates", layer: "infrastructure", tag: "predicate" },
        { folder: "guards", layer: "infrastructure", tag: "guard" },

        { folder: "registries", layer: "infrastructure", tag: "registry" },
        { folder: "resolvers", layer: "infrastructure", tag: "resolver" },
        { folder: "loaders", layer: "infrastructure", tag: "loader" },
        { folder: "factories", layer: "infrastructure", tag: "factory" },
        { folder: "manifests", layer: "infrastructure", tag: "manifest" },
        { folder: "bindings", layer: "infrastructure", tag: "binding" },
        { folder: "plugins", layer: "infrastructure", tag: "plugin" },
        { folder: "config", layer: "infrastructure", tag: "config" },
        { folder: "caches", layer: "infrastructure", tag: "cache" },

        { folder: "rules", layer: "domain", tag: "rule" },
        { folder: "policies", layer: "domain", tag: "policy" },
        { folder: "models", layer: "domain", tag: "model" },
        { folder: "invariants", layer: "domain", tag: "invariant" },
        { folder: "constraints", layer: "domain", tag: "constraint" },

        { folder: "coordinators", layer: "application", tag: "coordinator" },
        { folder: "orchestrators", layer: "application", tag: "orchestrator" },
        { folder: "services", layer: "application", tag: "service" },
        { folder: "stages", layer: "application", tag: "stage" },
        { folder: "steps", layer: "application", tag: "step" },

        { folder: "records", layer: "domain", tag: "record" },
        { folder: "collections", layer: "domain", tag: "collection" },
        { folder: "snapshots", layer: "domain", tag: "snapshot" },

        { folder: "readers", layer: "processing", tag: "reader" },
        { folder: "writers", layer: "processing", tag: "writer" },
        { folder: "transformers", layer: "processing", tag: "transformer" },
        { folder: "normalizers", layer: "processing", tag: "normalizer" },
        { folder: "formatters", layer: "processing", tag: "formatter" },

        { folder: "pipelines", layer: "processing", tag: "pipeline" },
        { folder: "processors", layer: "processing", tag: "processor" },
        { folder: "filters", layer: "processing", tag: "filter" },
        { folder: "validators", layer: "processing", tag: "validator" },
        { folder: "matchers", layer: "processing", tag: "matcher" },
        { folder: "comparators", layer: "processing", tag: "comparator" },

        { folder: "iterators", layer: "processing", tag: "iterator" },
        { folder: "generators", layer: "processing", tag: "generator" },
        { folder: "analyzers", layer: "processing", tag: "analyzer" },
        { folder: "inspectors", layer: "processing", tag: "inspector" },

        { folder: "errors", layer: "operations", tag: "error" },
        { folder: "results", layer: "operations", tag: "result" },
        { folder: "reporters", layer: "operations", tag: "reporter" },
        { folder: "reports", layer: "operations", tag: "report" },

        { folder: "entrypoints", layer: "runtime", tag: "entrypoint" },
        { folder: "runners", layer: "product", tag: "runner" },
        { folder: "fixtures", layer: "product", tag: "fixture" },
        { folder: "references", layer: "product", tag: "reference" },
        { folder: "roles", layer: "product", tag: "role" },
        { folder: "briefings", layer: "product", tag: "briefing" },
        { folder: "templates", layer: "product", tag: "template" },
        { folder: "inventories", layer: "operations", tag: "inventory" },
        { folder: "taxonomy", layer: "operations", tag: "taxonomy" },
    ],
    subjects: [
        "accumulator",
        "adapter",
        "agenda",
        "agent",
        "archive",
        "architecture",
        "artifact",
        "base",
        "binding",
        "blocking",
        "board",
        "channel",
        "checklist",
        "claim",
        "collab",
        "collaboration",
        "collapse",
        "comment",
        "conduct",
        "config",
        "coordination",
        "coordination-scalability",
        "converge",
        "corpus",
        "coupling",
        "coverage",
        "declaration",
        "definition",
        "dependency",
        "development",
        "delivery",
        "document",
        "emission",
        "entrypoint",
        "evidence",
        "fence",
        "file",
        "fixture",
        "gate",
        "governance",
        "graph",
        "index",
        "invocation",
        "join",
        "json",
        "layer",
        "literal",
        "manifest",
        "mark",
        "marker",
        "member",
        "owner",
        "path",
        "pattern",
        "pipeline",
        "placement",
        "process",
        "projection",
        "purity",
        "quality",
        "record",
        "reference",
        "repair",
        "report",
        "role",
        "rule",
        "schema",
        "scope",
        "signature",
        "secret",
        "segment",
        "slot",
        "snapshot",
        "source",
        "substrate",
        "surface",
        "sweep",
        "task",
        "taxonomy",
        "template",
        "tense",
        "text",
        "token",
        "typecheck",
        "venue",
        "verdict",
        "vocabulary",
    ],
    variants: ["comms", "project", "protocol"],
    derivedVariants: {
        source: "_agent-index.md",
        rule: "an agent letter is an IDENTITY allocated by the index, never a vocabulary word — the index is its one owner and the variant slot resolves against it, so a new seat needs no SSOT edit and the two can never disagree",
    },
    dualRole: [
        "binding",
        "checklist",
        "config",
        "entrypoint",
        "fixture",
        "manifest",
        "pipeline",
        "record",
        "reference",
        "report",
        "role",
        "rule",
        "snapshot",
        "taxonomy",
        "template",
    ],
    version: 1,
} as const;

export type TaxonomyConfig = typeof taxonomy;

export type Subject = TaxonomyConfig["subjects"][number];
export type Variant = TaxonomyConfig["variants"][number];
export type ConcernEntry = TaxonomyConfig["concerns"][number];
export type ConcernTag = ConcernEntry["tag"];
export type ConcernFolder = ConcernEntry["folder"];
export type GovernedRoot = keyof TaxonomyConfig["containers"];
export type CompoundMarker = TaxonomyConfig["grammar"]["compoundMarkers"][number];
export type VerificationMarker = TaxonomyConfig["grammar"]["verificationMarkers"][number];

type Assert<Name extends string, Overlap> = [Overlap] extends [never] ? true : [Name, Overlap];

export type DualRole = TaxonomyConfig["dualRole"][number];

export const NO_VERIFICATION_MARKER_OUTSIDE_COMPOUND: Assert<
    "a verification marker is not a declared compound marker",
    Exclude<VerificationMarker, CompoundMarker>
> = true;

export const NO_UNDECLARED_SUBJECT_CONCERN_OVERLAP: Assert<
    "subject is already a concern tag and is not declared dual-role",
    Exclude<Extract<Subject, ConcernTag>, DualRole>
> = true;

export const NO_UNUSED_DUAL_ROLE: Assert<
    "a word declared dual-role does not occupy both slots",
    Exclude<DualRole, Extract<Subject, ConcernTag>>
> = true;

export const NO_VARIANT_SUBJECT_OVERLAP: Assert<"variant is already a subject", Extract<Variant, Subject>> = true;

export const NO_VARIANT_CONCERN_OVERLAP: Assert<
    "variant is already a concern tag",
    Extract<Variant, ConcernTag>
> = true;

export const NO_MARKER_CONCERN_OVERLAP: Assert<
    "compound marker is already a concern tag",
    Extract<CompoundMarker, ConcernTag>
> = true;

export const EVERY_LAYER_DECLARED: Assert<
    "concern layer is not in the spine",
    Exclude<ConcernEntry["layer"], Layer>
> = true;
