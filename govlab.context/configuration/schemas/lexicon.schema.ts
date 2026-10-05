import {
    LABEL,
    OPTIONAL_LABEL,
    OPTIONAL_LABELS,
    OPTIONAL_OBJECT,
    OPTIONAL_RECORDS,
    OPTIONAL_TEXT,
    TEXT,
} from "#configuration/constants/field.constants";
import type { KindSchema } from "#types/field.types";
import { optionalRefs } from "#core/factories/field.factory";

export const TERM_KIND = "term";

export const LEX_SCHEMA: KindSchema = {
    aliases: OPTIONAL_LABELS,
    check: OPTIONAL_OBJECT,
    definition: TEXT,
    distinctFrom: OPTIONAL_RECORDS,
    enforcedBy: OPTIONAL_LABELS,
    example: OPTIONAL_TEXT,
    exemplar: OPTIONAL_OBJECT,
    id: OPTIONAL_LABEL,
    kind: LABEL,
    name: LABEL,
    seeAlso: optionalRefs("lexicon"),
};
