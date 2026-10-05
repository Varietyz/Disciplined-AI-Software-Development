import type { FieldSchema } from "#types/schema.types";

const COORDINATE_PAIR = 2;

export const isCoordinatePair = function isCoordinatePair(field: FieldSchema): boolean {
    return field.kind === "list" && field.elementNumeric && field.fixedLength === COORDINATE_PAIR;
};
