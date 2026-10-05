export interface GrammarSource {
    readonly lang: string;
    readonly npm?: string;
    readonly git?: string;
    readonly subdir?: string;
    readonly unsupported?: string;
}

export interface FileTypeEntry {
    readonly name: string;
    readonly fileTypes: string[];
}

export interface GrammarMeta {
    readonly entries: FileTypeEntry[];
    readonly pool: string[];
}

export type BuildKind = "built" | "fetch-failed" | "skipped" | "wasm-failed";

export interface BuildResult {
    readonly kind: BuildKind;
    readonly note: string;
    readonly fileTypes: string[];
    readonly lang: string;
}

export type FetchOutcome = { readonly error: string } | { readonly root: string };
