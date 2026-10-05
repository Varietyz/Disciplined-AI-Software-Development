import type { FieldSchema, Kind, Primitive } from "#types/schema.types";
import { isCoordinatePair } from "#core/predicates/schema.predicate";

const INFERENCE = new Map<string, readonly string[]>([
    ["scalar:integer", ["vector", "sequence"]],
    ["scalar:float", ["vector", "sequence"]],
    ["scalar:boolean", ["distribution", "sequence"]],
    ["scalar:string", ["distribution", "sequence"]],
    ["list:", ["graph"]],
    ["object:", ["tree"]],
]);

const COORDINATE_REPRESENTATIONS: readonly string[] = ["grid"];

const NUMERIC_LIST_REPRESENTATIONS: readonly string[] = ["graph", "vector"];

const inferKey = function inferKey(kind: Kind, primitive: Primitive | null): string {
    return `${kind}:${primitive ?? ""}`;
};

const inferField = function inferField(field: FieldSchema): readonly string[] {
    if (field.kind === "list" && field.elementNumeric) {
        return isCoordinatePair(field) ? COORDINATE_REPRESENTATIONS : NUMERIC_LIST_REPRESENTATIONS;
    }
    return INFERENCE.get(inferKey(field.kind, field.primitive)) ?? [];
};

export const inferMapping = function inferMapping(schema: readonly FieldSchema[]): Map<string, readonly string[]> {
    return new Map(
        schema
            .map((field): [string, readonly string[]] => [field.name, inferField(field)])
            .filter(([, representations]) => representations.length > 0),
    );
};

export const unrepresentable = function unrepresentable(schema: readonly FieldSchema[]): FieldSchema[] {
    const mapped = inferMapping(schema);
    return schema.filter((field) => !mapped.has(field.name));
};
