export const NO_RECORDS = "data source has no records array";

export const SCHEMA_NOT_ARRAY = "schema must be an array of field descriptors";

export const unsupportedValue = function unsupportedValue(type: string): string {
    return `unsupported value type: ${type}`;
};

export const mixedPrimitives = function mixedPrimitives(name: string, primitives: string): string {
    return `field "${name}" mixes primitives: ${primitives}`;
};

export const heterogeneousKinds = function heterogeneousKinds(name: string, kinds: string): string {
    return `field "${name}" has heterogeneous kinds: ${kinds}`;
};

export const unresolvedKind = function unresolvedKind(name: string): string {
    return `field "${name}" has no resolved kind`;
};

export const notAnObject = function notAnObject(record: string): string {
    return `record is not an object: ${record}`;
};

export const requiredField = function requiredField(name: string): string {
    return `field "${name}" is required`;
};

export const kindMismatch = function kindMismatch(name: string, expected: string, actual: string): string {
    return `field "${name}" expected ${expected}, got ${actual}`;
};

export const primitiveMismatch = function primitiveMismatch(name: string, expected: string): string {
    return `field "${name}" expected ${expected}`;
};

export const unknownRecordFields = function unknownRecordFields(named: string): string {
    return `record has fields not in the schema: ${named}`;
};

export const invalidSchemaField = function invalidSchemaField(raw: string): string {
    return `invalid schema field: ${raw}`;
};

export const unknownMappingFields = function unknownMappingFields(named: string): string {
    return `mapping references fields not in the data: ${named}`;
};

export const NULL_PRIMITIVE = "null";
