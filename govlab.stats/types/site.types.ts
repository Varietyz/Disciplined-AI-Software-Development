export interface PageStats {
    files: number;
    isRoot: boolean;
    lines: number;
    name: string;
    rel: string;
    systems: number;
}

export interface SubsystemStats {
    container: string;
    folders: number;
}

export interface AppStats {
    assetBytes: number;
    assetFiles: number;
    pages: PageStats[];
    subsystems: SubsystemStats[];
    present: boolean;
    sourceFiles: number;
    sourceLines: number;
    styles: number;
}

export interface Tally {
    assetBytes: number;
    assetFiles: number;
    sourceFiles: number;
    sourceLines: number;
    styles: number;
}
