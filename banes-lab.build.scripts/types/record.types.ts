import type { Link, Linker, Placed, PlacementOf, Relation } from "#types/catalog.types";
import type { GovlabContext } from "@govlab/context";
import type { ReferenceRelation } from "@banes-lab/web/types/reference.types.js";

export interface RecordSources {
    readonly context: GovlabContext;
    readonly evidence: (ref: string) => readonly Link[];
    readonly inbound: (ref: string) => readonly ReferenceRelation[];
    readonly linkedBy: (ref: string) => readonly Link[];
    readonly placement: PlacementOf;
    readonly linker: Linker;
}

export interface RecordData extends Placed {
    readonly href: string | null;
    readonly kind: string;
    readonly layer: Link | null;
    readonly name: string;
    readonly ref: string;
    readonly relations: readonly Relation[];
    readonly summary: string | null;
}
