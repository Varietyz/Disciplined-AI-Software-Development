import type { DistinctDeclaration, Exemplar } from "#types/field.types";
import type { CheckFacet } from "#types/check.types";
import type { EXAMPLE_SHAPE_VOCABULARY } from "#configuration/constants/lexicon.constants";
import type { Logger } from "#types/ontology.types";
import type { UnreadKey } from "#types/record.types";

export type ExampleShape = (typeof EXAMPLE_SHAPE_VOCABULARY)[number]["value"];

export interface TermRecord {
    id?: string;
    name: string;
    kind: string;
    definition: string;
    aliases?: string[];
    seeAlso?: string[];
    enforcedBy?: string[];
    check?: CheckFacet;
    distinctFrom?: DistinctDeclaration[];
    example?: string;
    exemplar?: Exemplar;
}

export interface TermCategory {
    category: string;
    check?: CheckFacet;
    enforcedBy?: string[];
    exampleShape?: ExampleShape;
    records: TermRecord[];
}

export interface Term extends TermRecord {
    id: string;
    aliases: string[];
    seeAlso: string[];
    enforcedBy: string[];
    category: string;
    exampleShape?: ExampleShape;
}

export interface LexiconOptions {
    logger?: Logger | undefined;
    data?: TermCategory[];
    canonicalizeId?: ((term: string) => string) | undefined;
}

export interface TermFilter {
    kind?: string;
    category?: string;
    enforcedBy?: string;
}

export interface Lexicon {
    get: (id: string) => Term | null;
    all: () => Term[];
    ids: () => string[];
    resolve: (target: string) => Term | null;
    query: (filter?: TermFilter) => Term[];
    unreadKeys: () => UnreadKey[];
}

export interface PlacedFile {
    readonly folder: string;
    readonly subject: string;
    readonly variant: string | null;
    readonly tag: string;
    readonly extension: string;
}
