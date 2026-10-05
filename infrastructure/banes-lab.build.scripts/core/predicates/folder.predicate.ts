import type { AnatomyFolder } from "@banes-lab/web/types/anatomy.types.js";

export const holdsFiles = function holdsFiles(folder: AnatomyFolder): boolean {
    return folder.files.length > 0 || folder.folders.some(holdsFiles);
};
