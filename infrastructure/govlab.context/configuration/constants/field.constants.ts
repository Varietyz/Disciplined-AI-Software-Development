import type { FieldSpec } from "#types/field.types";

export const ID: FieldSpec = { required: true, type: "label" };
export const TEXT: FieldSpec = { required: true, type: "text" };
export const OPTIONAL_TEXT: FieldSpec = { required: false, type: "text" };
export const LABEL: FieldSpec = { required: true, type: "label" };
export const OPTIONAL_LABEL: FieldSpec = { required: false, type: "label" };
export const LABELS: FieldSpec = { required: true, type: "labels" };
export const OPTIONAL_LABELS: FieldSpec = { required: false, type: "labels" };
export const FLAG: FieldSpec = { required: true, type: "flag" };
export const OPTIONAL_FLAG: FieldSpec = { required: false, type: "flag" };
export const CLOSED: FieldSpec = { required: true, type: "closed" };
export const OBJECT: FieldSpec = { required: true, type: "object" };
export const OPTIONAL_OBJECT: FieldSpec = { required: false, type: "object" };
export const OPTIONAL_RECORDS: FieldSpec = { required: false, type: "records" };
export const RECORDS: FieldSpec = { required: true, type: "records" };

export const PATH_MARK = ".";

export const ID_FIELD = "id";

export const NONE_WORD = "none";

export const NONE_PREFIX = `${NONE_WORD}:`;

export const COMPOSITE_MEDIUM = "composite";

export const DEFAULT_EXEMPLAR_LANG = "ts";
