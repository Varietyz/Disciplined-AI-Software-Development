import { CACHE_FOLDER, INDEX_EXTENSION } from "#configuration/constants/fingerprint.constants";
import { absolutePath } from "@ssot/paths";

export const cacheFile = function cacheFile(name: string): string {
    return absolutePath("toolCache", CACHE_FOLDER, `${name}${INDEX_EXTENSION}`);
};
