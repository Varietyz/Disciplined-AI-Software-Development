import {
    CLOSED,
    LABEL,
    LABELS,
    OPTIONAL_LABEL,
    OPTIONAL_LABELS,
    OPTIONAL_OBJECT,
    OPTIONAL_RECORDS,
    OPTIONAL_TEXT,
    TEXT,
} from "#configuration/constants/field.constants";
import { REFACTORS_RELATION, VIOLATES_RELATION } from "@govlab/constants";
import { freeRefs, optionalRefs } from "#core/factories/field.factory";
import type { KindSchema } from "#types/field.types";

export const PRINCIPLE_KIND = "principle";

const RELATED = optionalRefs("architecture", "referenced-by");

export const ARCH_SCHEMA: KindSchema = {
    aliases: OPTIONAL_LABELS,
    canon: OPTIONAL_LABELS,
    check: OPTIONAL_OBJECT,
    conflicts_with: RELATED,
    definition: TEXT,
    detected_by: LABELS,
    distinctFrom: OPTIONAL_RECORDS,
    enables: RELATED,
    enforced_by: LABELS,
    exemplar: OPTIONAL_OBJECT,
    expressedBy: OPTIONAL_LABELS,
    formed_by: OPTIONAL_TEXT,
    id: OPTIONAL_LABEL,
    mandatoryFor: OPTIONAL_LABEL,
    measured_by: LABELS,
    name: LABEL,
    refactored_by: freeRefs(REFACTORS_RELATION),
    reinforces: RELATED,
    requires: RELATED,
    scope: LABELS,
    severity: CLOSED,
    tensions_with: RELATED,
    type: LABEL,
    violated_by: freeRefs(VIOLATES_RELATION),
};
