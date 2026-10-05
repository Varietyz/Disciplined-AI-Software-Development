import type { GRAMMAR_LEVELS } from "#configuration/strings/catalog.strings";
import type { Journal } from "#types/journal.types";

export interface Address {
    readonly json: string;
    readonly markdown: string | null;
}

export interface Identity {
    readonly address: Address;
    readonly href: string | null;
    readonly kind: string;
    readonly ref: string;
    readonly summary: string | null;
    readonly title: string;
}

export interface Link {
    readonly href: string | null;
    readonly json: string | null;
    readonly label: string;
    readonly markdown: string | null;
    readonly ref: string | null;
}

export interface Entry {
    readonly bytes: number;
    readonly fingerprint: string;
    readonly href: string | null;
    readonly json: string;
    readonly kind: string;
    readonly markdown: string | null;
    readonly ref: string;
    readonly summary: string | null;
    readonly title: string;
}

export interface ManifestRow {
    readonly bytes: number;
    readonly fingerprint: string;
    readonly json: string;
    readonly markdown: string | null;
    readonly ref: string;
}

export interface CatalogFiles {
    readonly json: readonly string[];
    readonly text: readonly string[];
}

export interface LeafText {
    readonly address: string;
    readonly body: string;
}

export interface Leaf {
    readonly data: object;
    readonly identity: Identity;
    readonly markdown: string | null;
    readonly text?: LeafText;
}

export interface Written {
    readonly entry: Entry;
    readonly leaf: Leaf;
}

export interface Relation {
    readonly links: readonly Link[];
    readonly relation: string;
}

export interface Unresolved {
    readonly from: string | null;
    readonly label: string;
    readonly target: string;
}

export interface Population {
    readonly name: string;
    readonly parts: Readonly<Record<string, number>>;
    readonly whole: number;
}

export interface Linker {
    readonly byHref: (href: string) => Identity | null;
    readonly byRef: (ref: string) => Identity | null;
    readonly link: (label: string, ref: string | null) => Link;
    readonly relink: (markdown: string, base: string) => string;
    readonly site: string;
    readonly unresolved: () => readonly Unresolved[];
}

export type Canonical = (href: string) => string;

export interface Placement {
    readonly siblings: { readonly next: Link | null; readonly previous: Link | null };
    readonly up: Link;
}

export interface Placed {
    readonly siblings: Placement["siblings"] | null;
    readonly up: Link | null;
}

export type PlacementOf = (ref: string) => Placement | null;

export type DataRenderer = (identity: Identity, data: object, site: string) => string;

export interface CatalogStore {
    readonly add: (leaves: readonly Leaf[]) => readonly Entry[];
    readonly entries: ReadonlyMap<string, Entry>;
    readonly files: ReadonlyMap<string, string>;
}

export interface Catalog {
    readonly files: ReadonlyMap<string, string>;
    readonly journal: Journal;
    readonly unresolved: readonly Unresolved[];
}

export type GrammarKind = keyof typeof GRAMMAR_LEVELS;

export interface GrammarRow {
    readonly address: Address;
    readonly kind: GrammarKind;
}

export interface GrammarData {
    readonly example?: string | null;
    readonly json: string;
    readonly kind?: string;
    readonly level: string;
    readonly markdown: string | null;
    readonly schema?: string | null;
    readonly template?: boolean;
}

export interface SiteParts {
    readonly collections: readonly Entry[];
    readonly documents: readonly Entry[];
    readonly pages: readonly Entry[];
    readonly queries: readonly Entry[];
    readonly trees: readonly Entry[];
}

export interface SiteStamp {
    readonly build: string;
    readonly updated: string | null;
    readonly version: number;
}

export interface SiteBuild extends SiteStamp {
    readonly published: readonly string[];
}

export interface SiteData extends SiteParts, SiteStamp {
    readonly canonical: string;
    readonly consent: string;
    readonly grammar: readonly GrammarData[];
    readonly summary: string;
    readonly title: string;
}

export interface ContactData {
    readonly address: string;
    readonly company: string;
    readonly country: string;
    readonly email: string;
    readonly founded: string;
    readonly links: Readonly<Record<string, string>>;
    readonly number: string;
    readonly owner: string;
    readonly reply: string;
}

export interface NumberRow {
    readonly kind: string;
    readonly link: Link;
    readonly number: string;
    readonly part: number | null;
}

export interface RouteRow {
    readonly block: string;
    readonly link: Link;
    readonly position: number;
    readonly requires: readonly (number | null)[];
}

export interface Navigation {
    readonly next: Link | null;
    readonly position: number;
    readonly previous: Link | null;
    readonly requires: readonly Link[];
    readonly stop: string;
    readonly total: number;
}
