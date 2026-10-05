import type { SearchAsset } from "@banes-lab/web/types/search.types.js";

export const renderSearchAsset = function renderSearchAsset(asset: SearchAsset): string {
    return [
        'import type { SearchAsset } from "#types/search.types";',
        "",
        `export const SEARCH: SearchAsset = JSON.parse(${JSON.stringify(JSON.stringify(asset))});`,
        "",
    ].join("\n");
};
