export interface ListenerSurfaces {
    readonly preview?: { readonly https?: unknown };
    readonly server?: { readonly https?: unknown; readonly middlewareMode?: unknown };
}

export interface TransportFinding {
    readonly file: string;
    readonly surface: string;
}
