import type { EdgeRelation, RepairField, SeverityLevel } from "#types/architecture.types";
import { KIND_DECISION_ORDER } from "#configuration/constants/kind.constants";
import type { VocabularyEntry } from "#types/vocabulary.types";

export const SEVERITY_TAXONOMY = [
    { definition: "A principle that applies to every system within its scope.", value: "mandatory" },
    { definition: "A principle that applies by default and gives way to a stated reason.", value: "recommended" },
    {
        definition:
            "A principle that applies only to the systems its Mandatory for field names, such as distributed systems.",
        value: "contextual",
    },
    { definition: "A design that is avoided unless a stated need calls for it.", value: "discouraged" },
] as const satisfies readonly VocabularyEntry[];

export const SEVERITY_LEVEL_VALUES: readonly SeverityLevel[] = SEVERITY_TAXONOMY.map((entry) => entry.value);

export const SEVERITY_LEVELS: ReadonlySet<string> = new Set(SEVERITY_LEVEL_VALUES);

export const CONDITIONAL_SEVERITY: SeverityLevel = "contextual";

export const EDGE_RELATIONS: readonly EdgeRelation[] = [
    "requires",
    "reinforces",
    "enables",
    "conflicts_with",
    "tensions_with",
];

export const NEGATIVE_KIND = "anti-pattern";

const NON_NEGATIVE: ReadonlySet<string> = new Set(KIND_DECISION_ORDER.filter((kind) => kind !== NEGATIVE_KIND));

const NEGATIVE_ONLY: ReadonlySet<string> = new Set([NEGATIVE_KIND]);

export const RELATION_RANGES: Record<EdgeRelation, ReadonlySet<string>> = {
    conflicts_with: NEGATIVE_ONLY,
    enables: NON_NEGATIVE,
    reinforces: NON_NEGATIVE,
    requires: NON_NEGATIVE,
    tensions_with: NON_NEGATIVE,
};

export const REPAIR_RANGES: Record<RepairField, ReadonlySet<string>> = {
    refactored_by: new Set(["technique", "pattern", "mechanism", "activity", "approach", "style", "model", "artifact"]),
    violated_by: NEGATIVE_ONLY,
};

export const REPAIR_FIELDS: readonly RepairField[] = ["refactored_by", "violated_by"];

export const EDGE_FIELDS: readonly { field: EdgeRelation; relation: string }[] = EDGE_RELATIONS.map((field) => ({
    field,
    relation: field,
}));

export const ARCH_SUBJECT = "arch";

export const PRINCIPLE_TYPE = "principle";

export const LABEL_EDGE_PREFIX = "label:";

export const ID_EDGE_PREFIX = "id:";
