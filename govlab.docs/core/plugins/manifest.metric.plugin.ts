import { MANIFEST_ERRORS } from "#configuration/strings/manifest.strings";
import type { ManifestPlugin } from "#types/manifest.types";

const SECTION = "repoMetrics";

export const plugin: ManifestPlugin = {
    name: "repo-metrics",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const value = manifest[SECTION];
            return value === undefined || typeof value === "boolean" ? [] : [MANIFEST_ERRORS.repoMetrics];
        },
    },
};
