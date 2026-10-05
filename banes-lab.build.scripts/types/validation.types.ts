export interface Finding {
    readonly file: string;
    readonly message: string;
}

export interface Twins {
    readonly json: string | null;
    readonly markdown: string | null;
}

export interface PageArtifact {
    readonly alternates: Twins;
    readonly canonical: string | null;
    readonly description: string | null;
    readonly links: readonly string[];
    readonly robots: string | null;
    readonly schema: string | null;
    readonly text: string;
    readonly title: string;
}

export interface ValidationRoute {
    readonly page: string;
    readonly path: string;
    readonly tab: string | null;
}

export interface Seen {
    readonly descriptions: Set<string>;
    readonly titles: Set<string>;
}
