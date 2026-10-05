import {
    BACKUP_MARK,
    BINARY_EXTENSIONS,
    MEDIA_EXTENSIONS,
    THIRD_PARTY_KEYS,
} from "#configuration/constants/exclusion.constants";
import { basename, extname } from "node:path";
import type { ExclusionReason } from "@ssot/secrets";
import type { PublishedFacts } from "#types/structure.types";
import { absolutePath } from "@ssot/paths";

const thirdPartyFolders = THIRD_PARTY_KEYS.map((key) => absolutePath(key));

export const exclusionOf = function exclusionOf(file: string): ExclusionReason | null {
    const extension = extname(file).toLowerCase();
    if (thirdPartyFolders.some((folder) => file.startsWith(folder))) {
        return "third-party-rule-text";
    }
    if (basename(file).includes(BACKUP_MARK)) {
        return "backup";
    }
    if (MEDIA_EXTENSIONS.has(extension)) {
        return "rendered-media";
    }
    return BINARY_EXTENSIONS.has(extension) ? "binary" : null;
};

export const isPublished = function isPublished(file: PublishedFacts, generatedSources: boolean): boolean {
    return file.excluded === undefined && !file.inherited && (generatedSources || !file.generated);
};
