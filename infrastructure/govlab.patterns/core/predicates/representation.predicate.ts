import { runtimeFor } from "#core/selectors/representation.selector";

export const isRepresentation = function isRepresentation(value: unknown): value is string {
    return typeof value === "string" && runtimeFor(value) !== undefined;
};
