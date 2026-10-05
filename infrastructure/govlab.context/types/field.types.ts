export type FieldType = "closed" | "flag" | "label" | "labels" | "object" | "records" | "ref" | "refs" | "text";

export interface FieldSpec {
    readonly type: FieldType;
    readonly required: boolean;
    readonly target?: string;
    readonly relation?: string;
    readonly flip?: boolean;
    readonly inverse?: string;
}

export type KindSchema = Readonly<Record<string, FieldSpec>>;

export interface DanglingField {
    readonly kind: string;
    readonly id: string;
    readonly field: string;
    readonly target: string;
    readonly value: string;
}

export type ExemplarMedium = "code" | "composite";

export interface Exemplar {
    before: string;
    after: string;
    lang: string;
    medium: ExemplarMedium;
}

export interface DistinctDeclaration {
    id: string;
    reason: string;
}
