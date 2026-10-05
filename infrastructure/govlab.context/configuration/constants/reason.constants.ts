import type { EvidenceSource, PredicateType, Verdict } from "#types/reason.surface.types";
import type { CollectionKind } from "#types/reason.types";
import type { VocabularyEntry } from "#types/vocabulary.types";

export const VERDICT_VOCABULARY = [
    { definition: "A verdict for a surface whose evidence is not empty and every claim in it holds.", value: "pass" },
    {
        definition: "A verdict for a surface whose evidence is not empty and a claim in it does not hold.",
        value: "fail",
    },
    {
        definition: "A verdict for a surface no evidence reaches, which a report keeps apart from pass.",
        value: "unknown",
    },
] as const satisfies readonly VocabularyEntry[];

export const PREDICATE_TYPE_VOCABULARY = [
    { definition: "A claim that a property holds in every state the surface reaches.", value: "invariant" },
    { definition: "A claim that two representations produce the same result.", value: "equivalence" },
    { definition: "A claim that a measured value stays within a limit.", value: "bound" },
    { definition: "A claim that one event happens before another.", value: "temporal-order" },
    { definition: "A claim that a value has its declared shape.", value: "schema" },
    { definition: "A claim that something does not occur, over a declared population.", value: "absence" },
] as const satisfies readonly VocabularyEntry[];

export const EVIDENCE_SOURCE_VOCABULARY = [
    {
        definition: "Evidence from running a test, which covers only the cases the test exercises.",
        value: "test-result",
    },
    { definition: "Evidence from reading the code without running it.", value: "analysis-report" },
    {
        definition: "Evidence seen while the system runs, which locates a failure but cannot show that none exists.",
        value: "runtime-observation",
    },
    { definition: "Evidence recorded as a value, such as a latency or a count.", value: "measurement" },
] as const satisfies readonly VocabularyEntry[];

export const VERDICTS: readonly Verdict[] = VERDICT_VOCABULARY.map((entry) => entry.value);

export const EVIDENCE_SOURCE_VALUES: readonly EvidenceSource[] = EVIDENCE_SOURCE_VOCABULARY.map((entry) => entry.value);

export const PREDICATE_TYPE_VALUES: readonly PredicateType[] = PREDICATE_TYPE_VOCABULARY.map((entry) => entry.value);

export const VERDICT_DOMAIN: ReadonlySet<string> = new Set(VERDICTS);

export const EVIDENCE_SOURCES: ReadonlySet<string> = new Set(EVIDENCE_SOURCE_VALUES);

export const PREDICATE_TYPES: ReadonlySet<string> = new Set(PREDICATE_TYPE_VALUES);

export const FREE_STEP_KIND = "label";

export const CONCEPT_COLLECTION_BY_AXIS: ReadonlyMap<string, CollectionKind> = new Map<string, CollectionKind>([
    ["ontology", "dimension"],
    ["analysis", "lens"],
    ["reasoning", "mode"],
    ["representation", "representation"],
]);

export const REASON_SUBJECT = "reason";

export const REASON_COLLECTION = "reasoning";

export const CELL_SEPARATOR = "::";

export const SHAPE_SEPARATOR = "|";

export const REASON_FILES = {
    axes: "axis.data.json",
    derivationLoop: "loop.derivation.data.json",
    dimensions: "dimension.data.json",
    edges: "link.data.json",
    failureShapes: "failure.data.json",
    invariants: "invariant.data.json",
    layers: "layer.data.json",
    lenses: "lens.data.json",
    maps: "index.data.json",
    mathDomains: "math.domain.data.json",
    mathTypes: "math.kind.data.json",
    models: "model.data.json",
    modes: "mode.data.json",
    nodes: "node.data.json",
    patternTypes: "pattern.kind.data.json",
    representations: "representation.data.json",
    substrate: "substrate.data.json",
    techniques: "technique.data.json",
    testSurfaces: "surface.data.json",
    universalAxes: "axis.universal.data.json",
} as const;
