export interface ArtifactRoot {
    readonly key: string;
    readonly path: string;
    readonly binding: string;
    readonly field: string;
    readonly unresolved: string | null;
}
