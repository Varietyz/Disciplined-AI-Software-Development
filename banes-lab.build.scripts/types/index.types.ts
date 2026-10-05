import type { Entry, Identity } from "#types/catalog.types";
import type { Discovery } from "#types/site.types";
import type { FacetGroup } from "#types/filter.types";
import type { Journal } from "#types/journal.types";
import type { ReferenceFaces } from "#types/ontology.types";
import type { SectionPlan } from "#types/section.types";
import type { SourceFile } from "#types/source.types";

export interface IndexScope {
    readonly collections: ReferenceFaces;
    readonly discovery: Discovery;
    readonly files: readonly SourceFile[];
    readonly groups: readonly FacetGroup[];
    readonly localPath: (path: string) => string;
    readonly plans: readonly SectionPlan[];
    readonly site: string;
}

export type Entries = ReadonlyMap<string, Entry>;

export interface Alternate {
    readonly json: string;
    readonly markdown: string;
}

export interface FacetSummary {
    readonly count: number;
    readonly field: string;
    readonly markdown: string;
    readonly value: string;
}

export interface IndexPart {
    readonly count: number;
    readonly first: string;
    readonly json: string;
    readonly last: string;
    readonly markdown: string | null;
}

export interface IndexData {
    readonly alternate?: Alternate | null;
    readonly facets?: readonly FacetSummary[];
    readonly parts?: readonly IndexPart[];
    readonly ref: string;
    readonly title: string;
}

export interface IndexPlan {
    readonly data: IndexData;
    readonly identity: Identity;
    readonly refs: readonly string[];
}

export interface SourcePlans {
    readonly folders: readonly IndexPlan[];
    readonly trees: readonly IndexPlan[];
}

export interface LevelMembers {
    readonly collections: readonly IndexPlan[];
    readonly facets: readonly IndexPlan[];
    readonly pages: readonly IndexPlan[];
    readonly trees: readonly IndexPlan[];
}

export interface FacetLevels {
    readonly collections: readonly IndexPlan[];
    readonly fields: readonly IndexPlan[];
}

export interface CatalogClose {
    readonly discovery: Discovery;
    readonly indexes: IndexPlans;
    readonly journal: Journal;
    readonly queries: readonly Entry[];
}

export interface IndexPlans {
    readonly collections: readonly IndexPlan[];
    readonly facetCollections: readonly IndexPlan[];
    readonly facetFields: readonly IndexPlan[];
    readonly facets: readonly IndexPlan[];
    readonly folders: readonly IndexPlan[];
    readonly levels: readonly IndexPlan[];
    readonly pages: readonly IndexPlan[];
    readonly tabs: readonly IndexPlan[];
    readonly trees: readonly IndexPlan[];
}
