import type { FieldSpec } from "#types/field.types";

const withInverse = function withInverse(spec: FieldSpec, inverse: string | undefined): FieldSpec {
    return inverse === undefined ? spec : { ...spec, inverse };
};

export const ref = function ref(target: string, inverse?: string): FieldSpec {
    return withInverse({ required: true, target, type: "ref" }, inverse);
};

export const optionalRef = function optionalRef(target: string, inverse?: string): FieldSpec {
    return withInverse({ required: false, target, type: "ref" }, inverse);
};

export const refs = function refs(target: string, inverse?: string): FieldSpec {
    return withInverse({ required: true, target, type: "refs" }, inverse);
};

export const optionalRefs = function optionalRefs(target: string, inverse?: string): FieldSpec {
    return withInverse({ required: false, target, type: "refs" }, inverse);
};

export const freeRefs = function freeRefs(inverse: string): FieldSpec {
    return { inverse, required: false, type: "refs" };
};

export const listedBy = function listedBy(spec: FieldSpec, relation: string): FieldSpec {
    return { ...spec, flip: true, relation };
};

export const kept = function kept(spec: FieldSpec, relation: string): FieldSpec {
    return { ...spec, flip: false, relation };
};
