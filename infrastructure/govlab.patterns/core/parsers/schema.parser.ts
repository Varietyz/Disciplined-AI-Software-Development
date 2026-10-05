import type { FieldSchema, Kind, Primitive } from "#types/schema.types";
import { SCHEMA_NOT_ARRAY, invalidSchemaField } from "#configuration/strings/schema.strings";
import { DataLoadError } from "#core/classifiers/schema.classifier";
import { isRecord } from "#core/predicates/record.predicate";

const KIND_NAMES: ReadonlySet<string> = new Set(["list-of-objects", "list", "object", "scalar"]);
const PRIMITIVE_NAMES: ReadonlySet<string> = new Set(["boolean", "float", "integer", "string"]);

const isKind = function isKind(value: unknown): value is Kind {
    return typeof value === "string" && KIND_NAMES.has(value);
};

const isPrimitive = function isPrimitive(value: unknown): value is Primitive {
    return typeof value === "string" && PRIMITIVE_NAMES.has(value);
};

const fieldFromDict = function fieldFromDict(raw: unknown): FieldSchema {
    if (!isRecord(raw)) {
        throw new DataLoadError(invalidSchemaField(JSON.stringify(raw)));
    }
    const { name, kind, primitive, fixedLength, elementNumeric, nullable } = raw;
    if (typeof name !== "string" || !isKind(kind)) {
        throw new DataLoadError(invalidSchemaField(JSON.stringify(raw)));
    }
    return {
        elementNumeric: elementNumeric === true,
        fixedLength: typeof fixedLength === "number" ? fixedLength : null,
        kind,
        name,
        nullable: nullable === true,
        primitive: isPrimitive(primitive) ? primitive : null,
    };
};

export const schemaFromDict = function schemaFromDict(data: unknown): FieldSchema[] {
    if (!Array.isArray(data)) {
        throw new DataLoadError(SCHEMA_NOT_ARRAY);
    }
    return data.map(fieldFromDict);
};
