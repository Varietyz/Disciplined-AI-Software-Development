import type { ENVIRONMENT_KIND_RULES, ENVIRONMENT_SCOPES } from "#configuration/constants/environment.constants";
import type { ENVIRONMENT_ENTRIES } from "#configuration/schemas/environment.schema";

export type EnvironmentKindRule = (typeof ENVIRONMENT_KIND_RULES)[number];

export type EnvironmentKind = EnvironmentKindRule["kind"];

export type EnvironmentScope = (typeof ENVIRONMENT_SCOPES)[number];

export interface EnvironmentEntry {
    readonly key: string;
    readonly kind: EnvironmentKind;
    readonly required: boolean;
    readonly scope: EnvironmentScope;
}

type DeclaredEntry = (typeof ENVIRONMENT_ENTRIES)[number];

export type EnvironmentKey = DeclaredEntry["key"];

export type PortKey = Extract<DeclaredEntry, { readonly kind: "port"; readonly required: true }>["key"];

export type TextKey = Exclude<Extract<DeclaredEntry, { readonly required: true }>["key"], PortKey>;

export type OptionalKey = Extract<DeclaredEntry, { readonly required: false }>["key"];

export interface FieldLabel {
    readonly label: string;
}

export interface EntryAnswer {
    readonly answer: string;
    readonly entry: { readonly fields: readonly FieldLabel[] };
}

export interface ValueAnswer {
    readonly answer: string;
    readonly value: string;
}
