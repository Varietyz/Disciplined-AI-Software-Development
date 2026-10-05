export interface CollectOptions {
    excluded?: (dir: string) => boolean;
    include?: (name: string) => boolean;
}

export interface FolderScan {
    readonly dirs: string[];
    readonly files: string[];
}
