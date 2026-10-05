import type { GovlabContext } from "@govlab/context";

export interface FacetGroup {
    readonly collection: string;
    readonly field: string;
    readonly ids: readonly string[];
    readonly slug: string;
    readonly value: string;
}

export interface FacetField {
    readonly collection: string;
    readonly field: string;
    readonly members: (context: GovlabContext, value: string) => readonly string[];
    readonly values: (context: GovlabContext) => readonly string[];
}
