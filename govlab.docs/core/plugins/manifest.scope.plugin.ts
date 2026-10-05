import type { ManifestPlugin } from "#types/manifest.types";
import { recordField } from "#core/selectors/record.selector";

const SECTION = "visibility";
const HIDDEN_FLAG = "hidden";
const PRIVATE_FLAG = "private";

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        entry[HIDDEN_FLAG] = recordField(manifest, SECTION)?.[HIDDEN_FLAG] === true;
    },
    filter(manifest) {
        return recordField(manifest, SECTION)?.[PRIVATE_FLAG] === true;
    },
    name: "visibility",
};
