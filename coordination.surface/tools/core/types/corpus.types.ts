export interface CorpusMove {
    readonly from: string;
    readonly to: string;
    readonly facet: string;
    readonly key: string;
    readonly variant: string | null;
}

export interface CorpusRoot {
    readonly facetFields: readonly string[];
    readonly facetByValue: Record<string, string>;
    readonly variantByOrigin: Record<string, string>;
    readonly filedUnder: string;
}
