export type Kind = "list-of-objects" | "list" | "object" | "scalar";

export type Primitive = "boolean" | "float" | "integer" | "string";

export interface FieldSchema {
    name: string;
    kind: Kind;
    primitive: Primitive | null;
    nullable: boolean;
    elementNumeric: boolean;
    fixedLength: number | null;
}
