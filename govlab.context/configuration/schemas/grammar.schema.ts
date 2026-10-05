import type { FieldSpec, KindSchema } from "#types/field.types";
import {
    LABEL,
    LABELS,
    OBJECT,
    OPTIONAL_LABEL,
    OPTIONAL_LABELS,
    OPTIONAL_RECORDS,
    RECORDS,
    TEXT,
} from "#configuration/constants/field.constants";
import { freeRefs, ref } from "#core/factories/field.factory";

export const PAG_KINDS = {
    documentType: "document-type",
    keyword: "keyword",
    production: "production",
    template: "template",
} as const;

const GROUNDS: FieldSpec = freeRefs("grounded-by");

export const PAG_SCHEMA: ReadonlyMap<string, KindSchema> = new Map<string, KindSchema>([
    [
        PAG_KINDS.documentType,
        {
            aliases: OPTIONAL_LABELS,
            axis: ref("reasoning:axis"),
            defaultVerb: LABEL,
            grounds: GROUNDS,
            model: ref("reasoning:model"),
            purpose: TEXT,
            type: LABEL,
            verbs: LABELS,
        },
    ],
    [
        PAG_KINDS.keyword,
        {
            aliases: OPTIONAL_LABELS,
            category: LABEL,
            distinctFrom: OPTIONAL_RECORDS,
            example: TEXT,
            grounds: GROUNDS,
            keyword: LABEL,
            meaning: TEXT,
            roles: OPTIONAL_RECORDS,
        },
    ],
    [PAG_KINDS.production, { aliases: OPTIONAL_LABELS, grounds: GROUNDS, group: LABEL, lhs: LABEL, rhs: TEXT }],
    [
        PAG_KINDS.template,
        {
            aliases: OPTIONAL_LABELS,
            body: TEXT,
            check: OBJECT,
            constraints: LABELS,
            copyright: OPTIONAL_LABEL,
            slots: RECORDS,
            title: LABEL,
            type: LABEL,
        },
    ],
]);
