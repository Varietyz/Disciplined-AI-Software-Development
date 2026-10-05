import type { FieldType } from "#types/field.types";

export const SHAPE_NAMES: Readonly<Record<FieldType, string>> = {
    closed: "a string",
    flag: "true or false",
    label: "a string",
    labels: "a list of strings",
    object: "an object",
    records: "a list of objects",
    ref: "a record id",
    refs: "a list of record ids",
    text: "a string",
};

export const NO_ID = "(no id)";

export const missingField = function missingField(path: string): string {
    return `has no ${path}, which its kind requires`;
};

export const misshapenField = function misshapenField(path: string, shape: string): string {
    return `has ${path} set to something other than ${shape}`;
};

export const nonKebabId = function nonKebabId(id: string): string {
    return `has the id "${id}", which is not kebab-case`;
};

export const refusedRecord = function refusedRecord(
    subject: string,
    kind: string,
    id: string,
    defects: readonly string[],
): string {
    return `${subject}: the ${kind} "${id}" ${defects.join("; ")}`;
};

export const outsideVocabulary = function outsideVocabulary(
    subject: string,
    value: string,
    values: readonly string[],
): string {
    return `${subject} declares "${value}", and its vocabulary declares only ${values.join(", ")}`;
};
