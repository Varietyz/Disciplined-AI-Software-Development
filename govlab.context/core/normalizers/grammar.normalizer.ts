import { DEFAULT_SLOT_KIND, PAG_SUBJECT } from "#configuration/constants/grammar.constants";
import type {
    DocumentTypeRecord,
    KeywordRecord,
    KeywordRole,
    ProductionRecord,
    TemplateRecord,
    TemplateSlot,
} from "#types/grammar.types";
import {
    asDistinctFrom,
    asString,
    asStringArray,
    optionalString,
    optionalStrings,
} from "#core/normalizers/field.normalizer";
import { PAG_SCHEMA } from "#configuration/schemas/grammar.schema";
import { isObject } from "#core/predicates/record.predicate";
import { refuseRecord } from "#core/validators/field.validator";
import { undeclaredPagKind } from "#configuration/strings/grammar.strings";

const normalizeRole = function normalizeRole(raw: Record<string, unknown>): KeywordRole {
    return {
        category: asString(raw["category"]),
        example: asString(raw["example"]),
        meaning: asString(raw["meaning"]),
        ...optionalStrings(raw, "grounds"),
    };
};

export const normalizeKeyword = function normalizeKeyword(raw: Record<string, unknown>): KeywordRecord {
    const distinctFrom = asDistinctFrom(raw["distinctFrom"]);
    const further = (Array.isArray(raw["roles"]) ? raw["roles"] : []).filter(isObject).map(normalizeRole);
    return {
        keyword: asString(raw["keyword"]),
        roles: [normalizeRole(raw), ...further],
        ...optionalStrings(raw, "aliases"),
        ...(distinctFrom.length > 0 ? { distinctFrom } : {}),
    };
};

export const normalizeDocumentType = function normalizeDocumentType(raw: Record<string, unknown>): DocumentTypeRecord {
    return {
        defaultVerb: asString(raw["defaultVerb"]),
        purpose: asString(raw["purpose"]),
        type: asString(raw["type"]),
        verbs: asStringArray(raw["verbs"]),
        ...optionalStrings(raw, "aliases"),
        ...optionalStrings(raw, "grounds"),
        ...optionalString(raw, "model"),
        ...optionalString(raw, "axis"),
    };
};

export const normalizeProduction = function normalizeProduction(raw: Record<string, unknown>): ProductionRecord {
    return {
        group: asString(raw["group"]),
        lhs: asString(raw["lhs"]),
        rhs: asString(raw["rhs"]),
        ...optionalStrings(raw, "aliases"),
        ...optionalStrings(raw, "grounds"),
    };
};

const normalizeSlot = function normalizeSlot(raw: Record<string, unknown>): TemplateSlot {
    const choices = asStringArray(raw["enum"]);
    return {
        description: asString(raw["description"]),
        kind: asString(raw["kind"]) || DEFAULT_SLOT_KIND,
        name: asString(raw["name"]),
        required: raw["required"] === true,
        ...(Array.isArray(raw["enum"]) && raw["enum"].length > 0 ? { enum: choices } : {}),
    };
};

export const normalizeTemplate = function normalizeTemplate(raw: Record<string, unknown>): TemplateRecord {
    return {
        body: asString(raw["body"]),
        constraints: asStringArray(raw["constraints"]),
        slots: (Array.isArray(raw["slots"]) ? raw["slots"] : []).filter(isObject).map(normalizeSlot),
        title: asString(raw["title"]),
        type: asString(raw["type"]),
        ...optionalStrings(raw, "aliases"),
    };
};

export const refused = function refused<T>(
    kind: string,
    normalize: (raw: Record<string, unknown>) => T,
): (raw: Record<string, unknown>) => T {
    return (raw) => {
        const schema = PAG_SCHEMA.get(kind);
        if (schema === undefined) {
            throw new Error(undeclaredPagKind(kind));
        }
        refuseRecord(PAG_SUBJECT, kind, schema, raw);
        return normalize(raw);
    };
};
