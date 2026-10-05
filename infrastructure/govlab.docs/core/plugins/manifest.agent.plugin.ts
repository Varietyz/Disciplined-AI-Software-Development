import type { ManifestPlugin } from "#types/manifest.types";
import { isPlainRecord } from "#core/predicates/record.predicate";

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        const { docs } = manifest;
        entry["aiContext"] = isPlainRecord(docs) && Boolean(docs["aiContext"]);
    },
    name: "ai-context",
};
