import { ARCH_SCHEMA, PRINCIPLE_KIND } from "#configuration/schemas/architecture.schema";
import { ARCH_SUBJECT, SEVERITY_LEVEL_VALUES } from "#configuration/constants/architecture.constants";
import { asCheck, mergeCheck } from "#core/converters/check.converter";
import { asClosed, asDistinctFrom, asExemplar, asString, asStringArray } from "#core/normalizers/field.normalizer";
import type { CheckFacet } from "#types/check.types";
import type { Principle } from "#types/architecture.types";
import { refuseRecord } from "#core/validators/field.validator";
import { severityOf } from "#configuration/strings/architecture.strings";
import { slugify } from "#core/converters/identifier.converter";

export const normalizePrinciple = function normalizePrinciple(
    raw: Record<string, unknown>,
    category: string,
    declared: CheckFacet | null,
): Principle {
    refuseRecord(ARCH_SUBJECT, PRINCIPLE_KIND, ARCH_SCHEMA, raw);
    const name = asString(raw["name"]);
    const exemplar = asExemplar(raw["exemplar"]);
    const mandatoryFor = asString(raw["mandatoryFor"]);
    const check = mergeCheck(declared, asCheck(raw["check"]));
    const canon = asStringArray(raw["canon"]);
    const distinctFrom = asDistinctFrom(raw["distinctFrom"]);
    const expressedBy = asStringArray(raw["expressedBy"]);
    const formedBy = asString(raw["formed_by"]);
    const violatedBy = asStringArray(raw["violated_by"]);
    return {
        aliases: asStringArray(raw["aliases"]),
        category,
        conflicts_with: asStringArray(raw["conflicts_with"]),
        definition: asString(raw["definition"]),
        detected_by: asStringArray(raw["detected_by"]),
        enables: asStringArray(raw["enables"]),
        enforced_by: asStringArray(raw["enforced_by"]),
        id: asString(raw["id"]) || slugify(name),
        measured_by: asStringArray(raw["measured_by"]),
        name,
        refactored_by: asStringArray(raw["refactored_by"]),
        reinforces: asStringArray(raw["reinforces"]),
        requires: asStringArray(raw["requires"]),
        scope: asStringArray(raw["scope"]),
        severity: asClosed(SEVERITY_LEVEL_VALUES, raw["severity"], severityOf(name)),
        tensions_with: asStringArray(raw["tensions_with"]),
        type: asString(raw["type"]),
        ...(violatedBy.length > 0 ? { violated_by: violatedBy } : {}),
        ...(formedBy ? { formed_by: formedBy } : {}),
        ...(canon.length > 0 ? { canon } : {}),
        ...(check ? { check } : {}),
        ...(distinctFrom.length > 0 ? { distinctFrom } : {}),
        ...(exemplar ? { exemplar } : {}),
        ...(expressedBy.length > 0 ? { expressedBy } : {}),
        ...(mandatoryFor ? { mandatoryFor } : {}),
    };
};
