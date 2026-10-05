import { isObjectValue, typeOf } from "#core/converters/schema.converter";
import {
    schemaShapeDefect,
    schemaTypeDefect,
    schemaUndeclared,
    schemaUnrequired,
} from "#configuration/strings/catalog.strings";
import type { JsonSchema } from "#types/schema.types";

const OBJECT_TYPE = "object";
const ARRAY_TYPE = "array";
const NUMBER_TYPE = "number";
const INTEGER_TYPE = "integer";
const PATH_SEPARATOR = ".";
const ITEM_MARK = "[]";
const OBJECT_KEYS = ["additionalProperties", "properties", "required"] as const;

const typesOf = function typesOf(schema: JsonSchema): readonly string[] {
    if (schema.type === undefined) {
        return [];
    }
    return typeof schema.type === "string" ? [schema.type] : schema.type;
};

const admits = function admits(schema: JsonSchema, type: string): boolean {
    const types = typesOf(schema);
    return types.length === 0 || types.includes(type) || (type === INTEGER_TYPE && types.includes(NUMBER_TYPE));
};

export const schemaShapeDefects = function schemaShapeDefects(schema: JsonSchema, path: string): readonly string[] {
    const own = [
        ...OBJECT_KEYS.filter((key) => schema[key] !== undefined && !admits(schema, OBJECT_TYPE)).map((key) =>
            schemaShapeDefect(path, key, OBJECT_TYPE),
        ),
        ...(schema.items !== undefined && !admits(schema, ARRAY_TYPE)
            ? [schemaShapeDefect(path, "items", ARRAY_TYPE)]
            : []),
    ];
    const nested = [
        ...Object.entries(schema.properties ?? {}).flatMap(([key, child]) =>
            schemaShapeDefects(child, path + PATH_SEPARATOR + key),
        ),
        ...(schema.additionalProperties === undefined
            ? []
            : schemaShapeDefects(schema.additionalProperties, path + PATH_SEPARATOR + OBJECT_TYPE)),
        ...(schema.items === undefined ? [] : schemaShapeDefects(schema.items, path + ITEM_MARK)),
    ];
    return [...own, ...nested];
};

const objectDefects = function objectDefects(
    value: Record<string, unknown>,
    schema: JsonSchema,
    path: string,
): readonly string[] {
    const missing = (schema.required ?? []).filter((key) => !(key in value)).map((key) => schemaUnrequired(path, key));
    const fields = Object.entries(value).flatMap(([key, child]) => {
        const declared = schema.properties?.[key] ?? schema.additionalProperties;
        if (declared === undefined) {
            return schema.properties === undefined ? [] : [schemaUndeclared(path, key)];
        }
        return instanceDefects(child, declared, path + PATH_SEPARATOR + key);
    });
    return [...missing, ...fields];
};

export const instanceDefects = function instanceDefects(
    value: unknown,
    schema: JsonSchema,
    path: string,
): readonly string[] {
    const type = typeOf(value);
    if (!admits(schema, type)) {
        return [schemaTypeDefect(path, type, typesOf(schema))];
    }
    if (isObjectValue(value)) {
        return objectDefects(value, schema, path);
    }
    if (Array.isArray(value) && schema.items !== undefined) {
        const { items } = schema;
        return value.flatMap((item) => instanceDefects(item, items, path + ITEM_MARK));
    }
    return [];
};
