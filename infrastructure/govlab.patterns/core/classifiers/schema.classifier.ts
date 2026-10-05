import type { Kind, Primitive } from "#types/schema.types";
import { mixedPrimitives, unsupportedValue } from "#configuration/strings/schema.strings";
import { isRecord } from "#core/predicates/record.predicate";

const SCALAR_TYPES: ReadonlySet<string> = new Set(["boolean", "number", "string"]);

export class DataLoadError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "DataLoadError";
    }
}

const listKind = function listKind(value: readonly unknown[]): Kind {
    return value.length > 0 && value.every((element) => isRecord(element)) ? "list-of-objects" : "list";
};

export const kindOf = function kindOf(value: unknown): Kind {
    if (Array.isArray(value)) {
        return listKind(value);
    }
    if (isRecord(value)) {
        return "object";
    }
    const type = typeof value;
    if (SCALAR_TYPES.has(type)) {
        return "scalar";
    }
    throw new DataLoadError(unsupportedValue(type));
};

export const primitiveOf = function primitiveOf(value: unknown, floatField: boolean): Primitive {
    if (typeof value === "boolean") {
        return "boolean";
    }
    if (typeof value === "number") {
        return floatField || !Number.isInteger(value) ? "float" : "integer";
    }
    return "string";
};

const isFloatFamily = function isFloatFamily(primitives: ReadonlySet<Primitive>): boolean {
    return (
        primitives.has("float") &&
        [...primitives].every((primitive) => primitive === "integer" || primitive === "float")
    );
};

export const resolvePrimitive = function resolvePrimitive(name: string, primitives: ReadonlySet<Primitive>): Primitive {
    if (isFloatFamily(primitives)) {
        return "float";
    }
    const [only] = [...primitives];
    if (primitives.size === 1 && only !== undefined) {
        return only;
    }
    throw new DataLoadError(mixedPrimitives(name, [...primitives].sort((a, b) => a.localeCompare(b)).join(", ")));
};

export const isBlank = function isBlank(value: unknown): boolean {
    return (value ?? null) === null;
};
