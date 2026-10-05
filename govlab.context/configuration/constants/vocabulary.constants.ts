import {
    EVIDENCE_SOURCE_VOCABULARY,
    PREDICATE_TYPE_VOCABULARY,
    VERDICT_VOCABULARY,
} from "#configuration/constants/reason.constants";
import { LAYER_EDGE_KIND_VOCABULARY, RESOLUTION_MECHANISM_VOCABULARY } from "#configuration/constants/layer.constants";
import type { ClosedVocabulary } from "#types/vocabulary.types";
import { DOMAIN_TIER_VOCABULARY } from "#configuration/constants/algorithm.constants";
import { EXAMPLE_SHAPE_VOCABULARY } from "#configuration/constants/lexicon.constants";
import { SEVERITY_TAXONOMY } from "#configuration/constants/architecture.constants";

export const CLOSED_VOCABULARIES: readonly ClosedVocabulary[] = [
    { entries: SEVERITY_TAXONOMY, id: "severity", relation: "severity" },
    { entries: DOMAIN_TIER_VOCABULARY, id: "domain-tier", relation: "tier" },
    { entries: VERDICT_VOCABULARY, id: "verdict", relation: "verdict-domain" },
    { entries: PREDICATE_TYPE_VOCABULARY, id: "predicate-type", relation: "predicate-type" },
    { entries: EVIDENCE_SOURCE_VOCABULARY, id: "evidence-source", relation: "evidence-source" },
    { entries: RESOLUTION_MECHANISM_VOCABULARY, id: "resolution-mechanism", relation: "mechanism" },
    { entries: LAYER_EDGE_KIND_VOCABULARY, id: "layer-edge-kind", relation: "edge-kind" },
    { entries: EXAMPLE_SHAPE_VOCABULARY, id: "example-shape", relation: "example-shape" },
];

export const CANONICAL_FORCES: ReadonlySet<string> = new Set([
    "architecture_evolution",
    "causality_ordering",
    "contract_compatibility",
    "control_coordination",
    "correctness_verification",
    "domain_boundary",
    "event_messaging",
    "metaprogramming_modeling",
    "model_governance",
    "modularity",
    "object_creation",
    "observability_traceability",
    "performance_scaling",
    "resilience_recovery",
    "runtime_extensibility",
    "security_governance",
    "semantic_consistency",
    "state_transaction",
    "streaming_dataflow",
]);

export const SPELLING_GAPS: ReadonlySet<string> = new Set([" ", "-"]);

export const FORCE_JOINER = "_";

export const ANTI_FORCE_MARK = "(";
