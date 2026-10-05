import type { Identity, Link, Linker, Navigation, Placed, PlacementOf, Relation } from "#types/catalog.types";
import type { ContentGraph } from "@banes-lab/web/types/methodology.types.js";
import type { DiscoveredPage } from "#types/site.types";
import type { FolderRelations } from "#types/source.types";

export interface SectionShape {
    readonly id: string;
    readonly intro?: string;
    readonly title: string;
}

export interface TabShape {
    readonly id: string | null;
    readonly label: string;
    readonly path: string;
    readonly sections: readonly SectionShape[];
}

export interface SectionPlan {
    readonly identity: Identity;
    readonly page: DiscoveredPage;
    readonly section: SectionShape;
    readonly tab: TabShape;
}

export type SectionExporter = (path: string, ids: readonly string[]) => readonly string[];

export interface SectionSources {
    readonly bodies: SectionExporter;
    readonly evidence: (href: string) => readonly Link[];
    readonly folder: (ref: string) => FolderRelations | null;
    readonly graphs: readonly ContentGraph[];
    readonly grounds: (ref: string) => readonly Link[];
    readonly linkedBy: (ref: string) => readonly Link[];
    readonly linker: Linker;
    readonly links: (ref: string) => readonly Link[];
    readonly navigation: (href: string) => Navigation | null;
    readonly numbers: ReadonlyMap<string, string>;
    readonly placement: PlacementOf;
}

export interface SectionPartAt {
    readonly part: number;
    readonly total: number;
}

export interface SectionEdges {
    readonly incoming: ReadonlyMap<string, readonly Link[]>;
    readonly outgoing: ReadonlyMap<string, readonly Link[]>;
}

export interface SectionRoute {
    readonly next: Link | null;
    readonly position: number;
    readonly previous: Link | null;
    readonly requires: readonly Link[];
    readonly total: number;
}

export interface SectionData extends Placed {
    readonly href: string;
    readonly relations: readonly Relation[];
    readonly route: SectionRoute | null;
    readonly summary: string | null;
    readonly title: string;
}
