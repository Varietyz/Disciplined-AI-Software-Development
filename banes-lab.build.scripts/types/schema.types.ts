import type { GrammarKind } from "#types/catalog.types";

export interface JsonSchema {
    readonly additionalProperties?: JsonSchema;
    readonly items?: JsonSchema;
    readonly properties?: Readonly<Record<string, JsonSchema>>;
    readonly required?: readonly string[];
    readonly type?: string | readonly string[];
}

export type KindSamples = ReadonlyMap<GrammarKind, readonly unknown[]>;
