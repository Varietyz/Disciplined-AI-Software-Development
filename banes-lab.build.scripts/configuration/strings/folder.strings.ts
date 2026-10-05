import type { FolderSync } from "#types/folder.types";

export const syncedLine = function syncedLine(step: string, sync: FolderSync): string {
    return `${step}: copied ${String(sync.copied)} changed file(s), removed ${String(sync.removed)}\n`;
};
