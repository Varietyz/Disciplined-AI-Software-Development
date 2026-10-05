export interface Frontmatter {
    present: boolean;
    fields: Record<string, string>;
    bodyStart: number;
}

export interface FrontmatterFields {
    fields: Record<string, string>;
    end: number;
}

export interface FieldSpec {
    enum?: readonly string[];
    items?: readonly string[];
    kind?: "boolean" | "integer" | "kebab";
}

export interface FrontmatterSchema {
    required: readonly string[];
    fields: Record<string, FieldSpec>;
}

export type FrontmatterSchemaCode = "invalid-enum" | "invalid-type" | "missing-required";

export interface FrontmatterSchemaDefect {
    code: FrontmatterSchemaCode;
    field: string;
    detail: string;
    line: number;
}

export interface FieldCheck {
    source: string;
    field: string;
    value: string;
    spec: FieldSpec;
}
