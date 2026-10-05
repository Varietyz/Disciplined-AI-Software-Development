import type { AnatomyLines, FolderRole } from "@banes-lab/web/types/anatomy.types.js";
import type { ExclusionReason } from "@ssot/secrets";

export interface DiskFile {
    readonly bytes: number;
    readonly excluded?: ExclusionReason;
    readonly generated: boolean;
    readonly inherited: boolean;
    readonly lines: AnatomyLines;
    readonly name: string;
    readonly path: string;
    readonly text: string;
}

export interface PublishedFacts {
    readonly excluded?: string;
    readonly generated: boolean;
    readonly inherited: boolean;
}

export interface DiskFolder {
    readonly files: readonly DiskFile[];
    readonly folders: readonly DiskFolder[];
    readonly governedBy?: string;
    readonly name: string;
    readonly path: string;
    readonly role: FolderRole;
}

export interface TreeScope {
    readonly excluded: (file: string) => ExclusionReason | null;
    readonly moduleDir: string;
    readonly pruned: (folder: string) => boolean;
    readonly root: string;
    readonly shipped: ReadonlySet<string>;
}
