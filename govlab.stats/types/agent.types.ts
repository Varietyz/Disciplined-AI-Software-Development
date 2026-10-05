export interface MemoryStats {
    byType: Map<string, number>;
    bytes: number;
    dir: string;
    files: number;
    indexEntries: number;
    present: boolean;
}

export interface MemoryFile {
    type: string | null;
    bytes: number;
    index: number;
}
