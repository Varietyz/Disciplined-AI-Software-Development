import type { DanglingField, FieldSpec, FieldType, KindSchema } from "#types/field.types";
import {
    NO_ID,
    SHAPE_NAMES,
    misshapenField,
    missingField,
    nonKebabId,
    refusedRecord,
} from "#configuration/strings/field.strings";
import { fieldValue, valuesAt } from "#core/selectors/field.selector";
import { isKebabId, lacksEntry } from "#core/predicates/field.predicate";
import { isPlainRecord, isStringList } from "#core/predicates/record.predicate";
import { ID_FIELD } from "#configuration/constants/field.constants";

const hasShape = function hasShape(type: FieldType, value: unknown): boolean {
    if (type === "flag") {
        return typeof value === "boolean";
    }
    if (type === "object") {
        return isPlainRecord(value);
    }
    if (type === "records") {
        return Array.isArray(value) && value.every(isPlainRecord);
    }
    if (type === "labels" || type === "refs") {
        return isStringList(value);
    }
    return typeof value === "string";
};

const fieldDefect = function fieldDefect(path: string, spec: FieldSpec, value: unknown): string | null {
    if (value === undefined) {
        return spec.required ? missingField(path) : null;
    }
    return hasShape(spec.type, value) ? null : misshapenField(path, SHAPE_NAMES[spec.type]);
};

export const emptyFields = function emptyFields(schema: KindSchema, record: unknown): string[] {
    return Object.entries(schema)
        .filter(([path, spec]) => spec.required && lacksEntry(fieldValue(record, path)))
        .map(([path]) => path);
};

export const recordDefects = function recordDefects(schema: KindSchema, raw: Record<string, unknown>): string[] {
    const defects = Object.entries(schema).flatMap(([path, spec]) => {
        const defect = fieldDefect(path, spec, fieldValue(raw, path));
        return defect === null ? [] : [defect];
    });
    const id = raw[ID_FIELD];
    return typeof id === "string" && !isKebabId(id) ? [...defects, nonKebabId(id)] : defects;
};

export const refuseRecord = function refuseRecord(
    subject: string,
    kind: string,
    schema: KindSchema,
    raw: Record<string, unknown>,
): void {
    const defects = recordDefects(schema, raw);
    if (defects.length > 0) {
        const id = typeof raw[ID_FIELD] === "string" ? raw[ID_FIELD] : NO_ID;
        throw new Error(refusedRecord(subject, kind, id, defects));
    }
};

export const danglingFields = function danglingFields(
    kind: string,
    schema: KindSchema,
    records: readonly { id: string }[],
    members: (target: string) => ReadonlySet<string> | undefined,
): DanglingField[] {
    return Object.entries(schema).flatMap(([field, spec]) => {
        const { target } = spec;
        const known = target === undefined ? undefined : members(target);
        if (known === undefined || target === undefined) {
            return [];
        }
        return records.flatMap((record) =>
            valuesAt(record, field)
                .filter((value) => !known.has(value))
                .map((value) => ({ field, id: record.id, kind, target, value })),
        );
    });
};
