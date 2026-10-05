import { COMPOSITE_MEDIUM, DEFAULT_EXEMPLAR_LANG } from "#configuration/constants/field.constants";
import type { DistinctDeclaration, Exemplar, ExemplarMedium } from "#types/field.types";
import { isObject } from "#core/predicates/record.predicate";
import { outsideVocabulary } from "#configuration/strings/field.strings";

export const asString = function asString(value: unknown): string {
    return typeof value === "string" ? value : "";
};

export const asStringArray = function asStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
};

export const asClosed = function asClosed<T extends string>(values: readonly T[], value: unknown, subject: string): T {
    const text = asString(value);
    const found = values.find((entry) => entry === text);
    if (found === undefined) {
        throw new Error(outsideVocabulary(subject, text, values));
    }
    return found;
};

export const asClosedArray = function asClosedArray<T extends string>(
    values: readonly T[],
    value: unknown,
    subject: string,
): T[] {
    return asStringArray(value).map((entry) => asClosed(values, entry, subject));
};

export const asDistinctFrom = function asDistinctFrom(value: unknown): DistinctDeclaration[] {
    return (Array.isArray(value) ? value : [])
        .filter(isObject)
        .map((entry) => ({ id: asString(entry["id"]), reason: asString(entry["reason"]) }));
};

export const asExemplar = function asExemplar(value: unknown): Exemplar | null {
    if (!isObject(value)) {
        return null;
    }
    const before = asString(value["before"]);
    const after = asString(value["after"]);
    if (!before && !after) {
        return null;
    }
    const medium: ExemplarMedium = asString(value["medium"]) === COMPOSITE_MEDIUM ? "composite" : "code";
    return { after, before, lang: asString(value["lang"]) || DEFAULT_EXEMPLAR_LANG, medium };
};

export const optionalStrings = function optionalStrings(
    raw: Record<string, unknown>,
    key: string,
): Record<string, string[]> {
    const value = asStringArray(raw[key]);
    return value.length > 0 ? { [key]: value } : {};
};

export const optionalString = function optionalString(
    raw: Record<string, unknown>,
    key: string,
): Record<string, string> {
    const value = asString(raw[key]);
    return value ? { [key]: value } : {};
};
