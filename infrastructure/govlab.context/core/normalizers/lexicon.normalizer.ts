import {
    ENFORCED_BY_KEY,
    EXAMPLE_SHAPE_KEY,
    EXAMPLE_SHAPE_VALUES,
    LEX_SUBJECT,
} from "#configuration/constants/lexicon.constants";
import type { ExampleShape, Term } from "#types/lexicon.types";
import { LEX_SCHEMA, TERM_KIND } from "#configuration/schemas/lexicon.schema";
import { asCheck, mergeCheck } from "#core/converters/check.converter";
import { asClosed, asDistinctFrom, asExemplar, asString, asStringArray } from "#core/normalizers/field.normalizer";
import type { CheckFacet } from "#types/check.types";
import type { Normalizer } from "#types/ontology.types";
import { exampleShapeOf } from "#configuration/strings/lexicon.strings";
import { refuseRecord } from "#core/validators/field.validator";
import { slugify } from "#core/converters/identifier.converter";

const enforcedByOf = function enforcedByOf(raw: Record<string, unknown>, group: Record<string, unknown>): string[] {
    const own = asStringArray(raw[ENFORCED_BY_KEY]);
    return own.length > 0 ? own : asStringArray(group[ENFORCED_BY_KEY]);
};

const shapeOf = function shapeOf(group: Record<string, unknown>, category: string): ExampleShape | null {
    return group[EXAMPLE_SHAPE_KEY] === undefined
        ? null
        : asClosed(EXAMPLE_SHAPE_VALUES, group[EXAMPLE_SHAPE_KEY], exampleShapeOf(category));
};

export const termNormalizer = function termNormalizer(collectionCheck: CheckFacet | null): Normalizer<Term> {
    return (raw, category, declared, group) => {
        refuseRecord(LEX_SUBJECT, TERM_KIND, LEX_SCHEMA, raw);
        const name = asString(raw["name"]);
        const check = mergeCheck(mergeCheck(collectionCheck, declared), asCheck(raw["check"]));
        const distinctFrom = asDistinctFrom(raw["distinctFrom"]);
        const exampleShape = shapeOf(group, category);
        const example = asString(raw["example"]);
        const exemplar = asExemplar(raw["exemplar"]);
        return {
            ...(exampleShape === null ? {} : { exampleShape }),
            ...(example.length > 0 ? { example } : {}),
            ...(exemplar === null ? {} : { exemplar }),
            aliases: asStringArray(raw["aliases"]),
            category,
            definition: asString(raw["definition"]),
            enforcedBy: enforcedByOf(raw, group),
            id: asString(raw["id"]) || slugify(name),
            kind: asString(raw["kind"]),
            name,
            seeAlso: asStringArray(raw["seeAlso"]),
            ...(check ? { check } : {}),
            ...(distinctFrom.length > 0 ? { distinctFrom } : {}),
        };
    };
};
