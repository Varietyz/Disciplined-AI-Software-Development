import { DataLoadError, isBlank, kindOf } from "#core/classifiers/schema.classifier";
import type { FieldSchema, Primitive } from "#types/schema.types";
import {
    NULL_PRIMITIVE,
    kindMismatch,
    notAnObject,
    primitiveMismatch,
    requiredField,
    unknownMappingFields,
    unknownRecordFields,
} from "#configuration/strings/schema.strings";
import { isRecord } from "#core/predicates/record.predicate";

const ACCEPTED: Readonly<Record<Primitive, ReadonlySet<string>>> = {
    boolean: new Set(["boolean"]),
    float: new Set(["number"]),
    integer: new Set(["number"]),
    string: new Set(["string"]),
};

const scalarMatches = function scalarMatches(value: unknown, primitive: Primitive | null): boolean {
    return primitive === null || ACCEPTED[primitive].has(typeof value);
};

const sortedList = function sortedList(names: readonly string[]): string {
    return names.toSorted((a, b) => a.localeCompare(b)).join(", ");
};

const validateField = function validateField(field: FieldSchema, record: Record<string, unknown>): void {
    const value = record[field.name];
    if (isBlank(value)) {
        if (!field.nullable) {
            throw new DataLoadError(requiredField(field.name));
        }
        return;
    }
    const kind = kindOf(value);
    if (kind !== field.kind) {
        throw new DataLoadError(kindMismatch(field.name, field.kind, kind));
    }
    if (kind === "scalar" && !scalarMatches(value, field.primitive)) {
        throw new DataLoadError(primitiveMismatch(field.name, field.primitive ?? NULL_PRIMITIVE));
    }
};

export const validateRecord = function validateRecord(
    record: unknown,
    schema: readonly FieldSchema[],
): Record<string, unknown> {
    if (!isRecord(record)) {
        throw new DataLoadError(notAnObject(JSON.stringify(record)));
    }
    const allowed = new Set(schema.map((field) => field.name));
    const unknown = Object.keys(record).filter((key) => !allowed.has(key));
    if (unknown.length > 0) {
        throw new DataLoadError(unknownRecordFields(sortedList(unknown)));
    }
    for (const field of schema) {
        validateField(field, record);
    }
    return record;
};

export const validateMapping = function validateMapping(
    mapping: ReadonlyMap<string, readonly string[]>,
    schema: readonly FieldSchema[],
): void {
    const fields = new Set(schema.map((field) => field.name));
    const unknown = [...mapping.keys()].filter((name) => !fields.has(name));
    if (unknown.length > 0) {
        throw new DataLoadError(unknownMappingFields(sortedList(unknown)));
    }
};
