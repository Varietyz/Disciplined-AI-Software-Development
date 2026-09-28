import { folderFor } from "./taxonomy.manifest.ts";
import { undeclaredConcernTag } from "../strings/taxonomy.strings.ts";

const ASSET_TAG = "asset";

const assetFolder = function assetFolder(): string {
    const folder = folderFor(ASSET_TAG);
    if (folder === undefined) {
        throw new Error(undeclaredConcernTag(ASSET_TAG));
    }
    return folder;
};

export const ASSET_MODULE_NAME = assetFolder();

export const ASSET_PATH_HINTS: readonly string[] = [
    `/${ASSET_MODULE_NAME}/`,
    "/static/",
    "/public/",
    "/media/",
    "/api/",
    "/v1/",
    "/v2/",
];
